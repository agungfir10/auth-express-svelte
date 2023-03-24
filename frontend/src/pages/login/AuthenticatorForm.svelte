<script>
  import axios from 'axios';
  import { push } from 'svelte-spa-router';
  export let loginData = {};

  let code = '';
  console.log(loginData);

  $: submit = async () => {
    const { data } = await axios.post(
      'two-factor',
      {
        ...loginData,
        code,
      },
      { withCredentials: true }
    );

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    await push('/');
  };
</script>

<main>
  <form on:submit|preventDefault={submit}>
    <label for="code">
      6 digits code
      <br />
      <input
        bind:value={code}
        type="text"
        id="code"
        placeholder="6 digits code"
      />
    </label>
    <button type="submit">Sign in</button>
  </form>
</main>
