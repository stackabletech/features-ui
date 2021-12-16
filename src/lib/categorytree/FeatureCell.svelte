<script lang="ts">
  export let productFeature;

</script>
<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {#if productFeature.scheduled_for}
    <div data-tip="{productFeature.scheduled_for}" class="tooltip">
      {productFeature.implemented}
    </div>
  {:else}
    {productFeature.implemented}
  {/if}
</td>
