import {
  doc,
  getDoc,
  collection,
  getDocs,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

/**
 * Cloud Firestore Data Schema:
 * 
 * /users/{uid}
 *   - createdAt
 *   - lastLogin
 *   - email
 *   - migratedFromLocal: boolean
 *   - migratedAt: timestamp
 * 
 * /users/{uid}/profile/info
 *   - name
 *   - avatarUrl
 *   - theme
 *   - isOnboarded
 * 
 * /users/{uid}/settings/budget
 *   - monthlyBudget
 *   - updatedAt
 * 
 * /users/{uid}/expenses/{expenseId}
 *   - id
 *   - title
 *   - amount
 *   - category
 *   - date
 *   - notes
 *   - createdAt
 * 
 * /users/{uid}/todos/{todoId}
 *   - id
 *   - title
 *   - priority
 *   - dueDate
 *   - completed
 *   - createdAt
 */

/**
 * Migrates local storage data to Cloud Firestore for the authenticated user.
 * Preserves existing records and guards against duplicate migration.
 */
export const migrateLocalDataToFirestore = async (uid, localData = {}) => {
  if (!isFirebaseConfigured || !db || !uid) return { success: false, reason: 'unconfigured' };

  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    // Guard: check if user data was already migrated in Firestore
    if (userDocSnap.exists() && userDocSnap.data()?.migratedFromLocal) {
      return { success: true, alreadyMigrated: true };
    }

    const batch = writeBatch(db);

    // 1. Profile
    if (localData.profile) {
      const profileRef = doc(db, 'users', uid, 'profile', 'info');
      batch.set(profileRef, {
        name: localData.profile.name || '',
        avatarUrl: localData.profile.avatarUrl || null,
        theme: localData.profile.theme || 'dark',
        isOnboarded: Boolean(localData.profile.isOnboarded),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }

    // 2. Budget
    if (typeof localData.monthlyBudget === 'number') {
      const budgetRef = doc(db, 'users', uid, 'settings', 'budget');
      batch.set(budgetRef, {
        monthlyBudget: localData.monthlyBudget,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }

    // 3. Expenses
    if (Array.isArray(localData.expenses) && localData.expenses.length > 0) {
      localData.expenses.forEach(exp => {
        if (!exp.id) return;
        const expRef = doc(db, 'users', uid, 'expenses', exp.id);
        batch.set(expRef, {
          ...exp,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      });
    }

    // 4. Tasks (Todos)
    if (Array.isArray(localData.todos) && localData.todos.length > 0) {
      localData.todos.forEach(todo => {
        if (!todo.id) return;
        const todoRef = doc(db, 'users', uid, 'todos', todo.id);
        batch.set(todoRef, {
          ...todo,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      });
    }

    // 5. Update user root document with migration status
    batch.set(userDocRef, {
      migratedFromLocal: true,
      migratedAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    }, { merge: true });

    await batch.commit();
    return { success: true, alreadyMigrated: false };
  } catch (error) {
    console.error('[CampusFlow] Error migrating data to Firestore:', error);
    return { success: false, error };
  }
};

/**
 * Fetch all user data from Firestore (useful for cloud sync).
 */
export const fetchUserFirestoreData = async (uid) => {
  if (!isFirebaseConfigured || !db || !uid) return null;

  try {
    // Profile
    const profileSnap = await getDoc(doc(db, 'users', uid, 'profile', 'info'));
    const profile = profileSnap.exists() ? profileSnap.data() : null;

    // Budget
    const budgetSnap = await getDoc(doc(db, 'users', uid, 'settings', 'budget'));
    const monthlyBudget = budgetSnap.exists() ? budgetSnap.data()?.monthlyBudget ?? 0 : 0;

    // Expenses
    const expensesSnap = await getDocs(collection(db, 'users', uid, 'expenses'));
    const expenses = expensesSnap.docs.map(doc => doc.data());

    // Todos
    const todosSnap = await getDocs(collection(db, 'users', uid, 'todos'));
    const todos = todosSnap.docs.map(doc => doc.data());

    return { profile, monthlyBudget, expenses, todos };
  } catch (error) {
    console.error('[CampusFlow] Error fetching Firestore user data:', error);
    return null;
  }
};

