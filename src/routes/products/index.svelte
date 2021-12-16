<script context="module" lang="ts">
  import {enhance} from '$lib/form';
  import type {Load} from '@sveltejs/kit';

  // see https://kit.svelte.dev/docs#loading
  export const load: Load = async ({fetch}) => {
    const res = await fetch('/products.json');

    if (res.ok) {
      const products = await res.json();

      return {
        props: {products}
      };
    }

    const {message} = await res.json();
    return {
      error: new Error(message)
    };
  };
</script>

<script lang="ts">
  import InPlaceEdit from '$lib/InPlaceEdit.svelte';
  import {Product} from "@prisma/client";

  export let products: Product[];

  async function patch(res: Response) {
    const product = await res.json();

    products = products.map((t) => {
      if (t.id === product.id) return product;
      return t;
    });
  }

  function submit() {
    console.log('submitting fss');
  }


</script>

<svelte:head>
  <title>Products</title>
</svelte:head>


<div class="products">
  <h1>Products</h1>

  <form
    action="/products.json"
    class="new form-control"
    method="post"
    use:enhance={{
      result: async (res, form) => {
        const created = await res.json();
        products = [...products, created];

        form.reset();
      }
    }}
  >
    <input aria-label="Add product" class="input input-bordered" name="name" placeholder="Add product"/>
  </form>

  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
      <tr>
        <th>Name</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      {#each products as product (product.id)}
        <tr>
          <td>
            <form
              action='/products/{product.id}.json?_method=patch'
              method='post'
            >
              <InPlaceEdit bind:value={product.name} on:submit={submit} name="name"/>
            </form>
          </td>
          <td>
            <form
              action="/products/{product.id}.json?_method=delete"
              method="post">
              <button class="btn btn-sm" aria-label="Delete product">Delete</button>
            </form>
          </td>
        </tr>
      {/each}
      </tbody>
    </table>
  </div>
</div>
