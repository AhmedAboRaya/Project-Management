
const routes = {
    userRoutes: {
      register: {
        method: 'POST',
        path: '/api/users/register',
        description: 'User registration',
      },
      login: {
        method: 'POST',
        path: '/api/users/login',
        description: 'User login',
      },
      profile: {
        method: 'GET',
        path: '/api/users/profile',
        description: 'Protected user profile data',
      },
    },
    
    taskRoutes: {
      createTask: {
        method: 'POST',
        path: '/api/tasks/users/:userId',
        description: 'Create a task for a specific user',
      },
      getTasks: {
        method: 'GET',
        path: '/api/tasks/users/:userId',
        description: 'Get tasks for a specific user',
      },
      updateTask: {
        method: 'PUT',
        path: '/api/tasks/:id',
        description: 'Update a specific task',
      },
      deleteTask: {
        method: 'DELETE',
        path: '/api/tasks/:id',
        description: 'Delete a specific task',
      },
    },
    
    projectRoutes: {
      createProject: {
        method: 'POST',
        path: '/api/projects',
        description: 'Create a new project',
      },
      getUserProjects: {
        method: 'GET',
        path: '/api/projects',
        description: 'Get projects for the authenticated user',
      },
      updateProject: {
        method: 'PUT',
        path: '/api/projects/:id',
        description: 'Update a project (only if the user is the owner)',
      },
      deleteProject: {
        method: 'DELETE',
        path: '/api/projects/:id',
        description: 'Delete a project (only if the user is the owner)',
      },
      addMember: {
        method: 'POST',
        path: '/api/projects/:id/members',
        description: 'Add a member to the project (only if the user is the owner)',
      },
    },
  };
  
  module.exports = routes;
  