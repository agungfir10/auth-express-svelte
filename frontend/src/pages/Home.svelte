<script>
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { authenticated } from '../store/auth';

  let message = 'You are not logged in';

  onMount(async () => {
    const { data, status } = await axios.get('user');
    if (status === 200) {
      message = `Hi ${data.first_name} ${data.last_name}`;
      authenticated.set(true);
    } else {
      message = 'You are not logged in';
      authenticated.set(false);
    }
  });
</script>

<h1>Home</h1>
<p>{message}</p>
