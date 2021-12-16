<script context="module" lang="ts">
  import type {Load} from '@sveltejs/kit';

  function test(categories, features, productFeatures) {
    for (const category of categories) {
      category.features = features.filter(feature => {
        return feature.category_id === parseInt(category.id)
      })

      for (const feature of category.features) {
        feature.products = productFeatures.filter(productFeature => productFeature.feature_id === feature.id)
      }

      if ('children' in category) {
        test(category.children, features, productFeatures);
      }

    }


    return categories;
  }

  // Convert the ids to string because it won't work with the Carbon component otherwise
  // see https://kit.svelte.dev/docs#loading
  export const load: Load = async ({fetch}) => {
    let res = await fetch('/categories.json');
    let categories;
    if (res.ok) {
      categories = await res.json();

      const unflatten = (id = null) => categories
        .filter(e => e['parent_id'] === id)
        .map(e => ({id: e['id'].toString(), name: e['name'], children: unflatten(e['id'])}))

      categories = unflatten();
    } else {
      const {message} = await res.json();
      return {
        error: new Error(message)
      };
    }

    res = await fetch('/features.json');
    let features;
    if (res.ok) {
      features = await res.json();
    } else {
      const {message} = await res.json();
      return {
        error: new Error(message)
      };
    }

    res = await fetch('/product_features.json');
    let productFeatures;
    if (res.ok) {
      productFeatures = await res.json();
    } else {
      const {message} = await res.json();
      return {
        error: new Error(message)
      };
    }

    res = await fetch('/products.json');
    let products;
    if (res.ok) {
      products = await res.json();
      products = products.map((p) => {
        return {
          id: `${p.id}`, text: p.name
        }
      });
    } else {
      const {message} = await res.json();
      return {
        error: new Error(message)
      };
    }

    let categoryTree = test(categories, features, productFeatures);

    /*
    Lade alle Categories und laufe rekursiv durch.
    Für jede Category gehe durch alle product_features
     */

    return {
      props: {
        categories, products, productFeatures, features, categoryTree
      }
    };

  };
</script>

<script lang="ts">
  import {MultiSelect} from "carbon-components-svelte";
  import CategoryTree from "$lib/categorytree/CategoryTree.svelte";

  export let categories;
  export let products;
  export let productFeatures;
  export let categoriesInUse: [number] = [];
  export let categoryTree;

  let selectedItems = []

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  $: {
    console.log("Updating now...")
    categoriesInUse = [];

    // For each selected product we'll look at all product features (loaded up front) and then select the categories that these features belong to
    for (const selectedItem of selectedItems) {
      categoriesInUse = categoriesInUse
        .concat(productFeatures
          .filter(productFeature => productFeature.product_id === parseInt(selectedItem))
          .map(productFeature => productFeature.features.category_id)
          .filter(onlyUnique));
    }
    // This will now be an array of all category ids that are being used by any feature of any of the selected products
    categoriesInUse = categoriesInUse.filter(onlyUnique);
  }

  function findProductName(selectedItem) {
    return products.find(product => product.id == selectedItem);
  }


</script>

<MultiSelect
  bind:selectedIds={selectedItems}
  filterable
  items={products}
  placeholder="Select products to display..."
  spellcheck="false"
  titleText="Products"
/>

{#if typeof selectedItems !== 'undefined' && selectedItems.length > 0}
  <!-- From https://tailwindui.com/components/application-ui/lists/tables -->
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Feature</th>
              {#each selectedItems as selectedItem}
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{findProductName(selectedItem).text}</th>
              {/each}
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <CategoryTree {categoryTree} selectedProducts="{selectedItems}"/>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
{/if}
