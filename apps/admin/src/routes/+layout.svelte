<script>
  import '../app.css';
  import Layout from '$components/Layout.svelte';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { browser } from '$app/environment';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        enabled: browser
      }
    }
  });

  let { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
  <Layout>
    {@render children()}
  </Layout>
</QueryClientProvider>
