<script>
  import axios from 'axios';
  import { push } from 'svelte-spa-router';
  import { authenticated } from '../store/auth';
  import { link } from 'svelte-spa-router';

  let email = '',
    password = '';

  $: submit = async () => {
    const { data } = await axios.post(
      'login',
      {
        email,
        password,
      },
      { withCredentials: true }
    );

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    authenticated.set(true);

    await push('/');
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
