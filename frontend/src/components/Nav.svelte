<script>
  import axios from 'axios';
  import { link } from 'svelte-spa-router';
  import { authenticated } from '../store/auth';
  let auth = false;

  authenticated.subscribe((value) => (auth = value));

  $: logout = async () => {
    await axios.post('logout', {}, { withCredentials: true });

    axios.defaults.headers.common['Authorization'] = ``;

    authenticated.set(false);
  };
</script>

<header style="margin-bottom:20px;">
  <span><a href="/" use:link>Svelte Auth</a></span>
  {#if auth}
    <nav>
      <a href="/login" use:link on:click={logout}>Logout</a>
    </nav>
  {:else}
    <nav>
      <a href="/login" use:link>Login</a>
      |
      <a href="/register" use:link>Register</a>
    </nav>
  {/if}
</header>
