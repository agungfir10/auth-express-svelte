<script>
  import axios from 'axios';
  import { push } from 'svelte-spa-router';

  let first_name,
    last_name = '',
    email = '',
    password = '',
    password_confirm = '';

  $: submit = async () => {
    await axios.post('register', {
      first_name,
      last_name,
      email,
      password,
      password_confirm,
    });

    await push('/login');
  };
</script>

<main>
  <form on:submit|preventDefault={submit}>
    <label for="first_name">
      First Name
      <br />
      <input
        bind:value={first_name}
        type="text"
        id="first_name"
        placeholder="First Name"
      />
    </label>
    <label for="last_name">
      Last Name
      <br />
      <input
        bind:value={last_name}
        type="text"
        id="last_name"
        placeholder="Last Name"
      />
    </label>
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
    <label for="password_confirm">
      Confirm Password
      <br />
      <input
        bind:value={password_confirm}
        type="password"
        id="password_confirm"
        placeholder="Confirm Password"
      />
    </label>
    <br />
    <button type="submit">Sign in</button>
  </form>
</main>
