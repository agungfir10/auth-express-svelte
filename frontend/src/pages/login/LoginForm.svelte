<script>
  import axios from 'axios';
  import { link } from 'svelte-spa-router';
  import { createEventDispatcher } from 'svelte';

  let email = '',
    password = '';

  const dispatch = createEventDispatcher();

  $: submit = async () => {
    const { data } = await axios.post('login', {
      email,
      password,
    });

    dispatch('login', data);
  };
</script>

<main>
  <form on:submit={submit}>
    <label for="email">
      Email
      <br />
      <input bind:value={email} type="email" id="email" placeholder="Email" />
    </label>
    <label for="password">
      Password
      <br />
      <input
        bind:value={password}
        type="password"
        id="password"
        placeholder="Password"
      />
    </label>
    <a href="/forgot" use:link>Forgot password?</a>
    <br />
    <button type="submit">Sign in</button>
  </form>
</main>
