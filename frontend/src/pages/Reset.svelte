<script>
  import axios from 'axios';

  export let params;

  let password_confirm = '',
    password = '';

  $: submit = async () => {
    await axios.post('reset', {
      password_confirm,
      password,
      token: params.token,
    });
  };
</script>

<main>
  <form on:submit={submit}>
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
      Password Confirm
      <br />
      <input
        bind:value={password_confirm}
        type="password"
        id="password_confirm"
        placeholder="Password Confirm"
      />
    </label>
    <br />
    <button type="submit">Send</button>
  </form>
</main>
