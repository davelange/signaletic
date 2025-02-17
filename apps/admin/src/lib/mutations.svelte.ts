import { createMutation } from '@tanstack/svelte-query';

export const updateDisplayScene = createMutation({
  mutationFn: async ({ projectId, config }) => {
    console.log(config);

    return fetch(`/projects/${projectId}?/editDisplayScene`, {
      method: 'POST',
      body: JSON.stringify(config),
      headers: {
        'Content-type': 'application/json'
      }
    });
  }
});
