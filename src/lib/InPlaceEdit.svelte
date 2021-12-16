<!-- Source: https://svelte.dev/repl/29c1026dda3c47a187bd21afa0782df1?version=3.31.2 -->
<script lang="ts">
  import {createEventDispatcher, onMount} from 'svelte'

  export let name = 'content';
  export let value;
  export let required = true;
  export let editing = false;

  const dispatch = createEventDispatcher()
  let original

  onMount(() => {
    original = value
  })

  function edit() {
    editing = true
  }

  function submit(event) {
    if (value === original) {
      event.preventDefault();
    } else {
      dispatch('submit', value)
      console.log("dispatched")
    }

    console.log("Submitting");

    editing = false
  }

  // This might not work with Tridactyl or other extensions that capture keys
  function keydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      value = original
      editing = false
    }
  }

  function cancel() {
    value = original;
    editing = false;
  }

  function focus(element) {
    element.focus()
  }
</script>

{#if editing}
  <input class="input input-bordered input-sm" name="{name}" bind:value {required} use:focus/>
  <button class="btn btn-sm" type="submit" on:click={submit}>Save</button>
  <button class="btn btn-sm" type="button" on:click={cancel}>Reset</button>
{:else}
  <div on:click={edit}>
    {value}
    <button class="btn btn-sm" type="button" on:click={editing}>Edit</button>
  </div>

{/if}

<style>

</style>
