<script lang="ts">
  import FeatureCell from "$lib/categorytree/FeatureCell.svelte";

  export let categoryPath: [string] = [];
  export let categoryTree;
  export let selectedProducts;

  console.log(categoryPath);

  function foo(product, feature) {
    let found = feature.products.find(product2 => product2.product_id == product)
    console.log(found);
    return found || {
      implemented: "n/a"
    };
  }

  function addCategoryToPath(category: string) {
    categoryPath.push(category);

  }
</script>

{#if selectedProducts !== undefined}
  {#each categoryTree as category}
    <tr>
      <td>{[...categoryPath, category.name].join(' -> ')}</td>
      <td></td>
      {#each selectedProducts as selectedProduct}
        <td></td>
      {/each}
    </tr>
    {#each category.features as feature}
      <tr>
        <td></td>
        <td>{feature.name}</td>
        {#each selectedProducts as selectedProduct}
          <FeatureCell productFeature="{foo(selectedProduct, feature)}"/>
        {/each}
      </tr>
    {/each}

    {#if 'children' in category}
      <svelte:self categoryPath="{[...categoryPath, category.name]}" categoryTree="{category.children}" {selectedProducts}/>
    {/if}

  {/each}
{/if}
