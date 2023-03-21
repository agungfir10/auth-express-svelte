<script>
  import axios from 'axios';

  let email = '',
    message = '';

  $: submit = async () => {
    const { status } = await axios.post('forgot', { email });
    if (status === 200) {
      message = 'Email was send!';
      email = '';
    } else {
      message = "Email does'nt exists!";
    }
  };
</script>

<main>
  <h3>Send link change password</h3>

  <form on:submit={submit}>
    <label for="email">
      Email
      <br />
      <input bind:value={email} type="email" id="email" placeholder="Email" />
    </label>
    <button type="submit">Sign in</button>
  </form>
  {#if message}
    <span style="color:red">{message}</span>
  {/if}
</main>
