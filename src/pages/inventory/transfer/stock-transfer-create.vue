<template>
  <Card pageTitle="New Stock Transfer">
    <AllowPermission :permission="PERMISSION_CODES.CMS_CREATE_TRANSFER">
      <div style="max-width:1000px">
        <div class="row">
          <div class="col-md-6"><div class="row">
            <div class="col-md-4">Transfer from Location*</div>
          <div class="col-md-8">
            <SelectDropdown
              v-if="warehouseSelectOptions.length"
              :options="warehouseSelectOptions"
              :multiple="false"
              :value="fromWarehouseId"
              @change="fromWarehouseId = $event"
            />
          </div>
          </div>
        </div>
          <div class="col-md-6"><div class="row">
          <div class="col-md-4">Select Room*</div>
          <div class="col-md-8">
            <SelectDropdown
              :options="Object.values(warehouseRooms)"
              :multiple="false"
              :value="warehouseRoom"
              @change="warehouseRoom = $event"
            />
          </div>
        </div>
      </div>
<div class="col-md-6">
  <div class="row">
          <div class="col-md-4">Transfer To Location*</div>
          <div class="col-md-8">
            <SelectDropdown
              v-if="warehouseSelectOptions.length"
              :options="warehouseSelectOptions"
              :multiple="false"
              :value="toWarehouseId"
              @change="toWarehouseId = $event"
            />
          </div>
        </div>
</div>
          <div class="col-md-6">
            <div class="row my-3">
          <div class="col-md-4">Notes</div>
          <div class="col-md-8">
            <CustomInput v-model="notes" type="text" />
          </div>
        </div>
          </div>
        </div>
        
        
        <!-- <div class="row my-3">
          <div class="col-md-4">ETA</div>
          <div class="col-md-8">
            <CustomInput v-model="eta" type="date" />
          </div>
        </div> -->
       
        <div class="my-3 d-flex justify-content-end" style="gap: 10px">
          <router-link to="/stock-transfers">
            <Button>Cancel</Button>
          </router-link>
          <Button @click="createTransfer">
            {{ processing ? "Please wait..." : "Save" }}
          </Button>
        </div>
      </div>
    </AllowPermission>
  </Card>
</template>

<script>
import { mapState } from "vuex";
import CustomInput from "../../../components/crud/custom-input.vue";
import SelectDropdown from "../../../components/crud/SelectDropdown.vue";
import Button from "../../../components/UI/Button.vue";
import Card from "../../../components/UI/Card.vue";
import { errMsg } from "../../../utils/common";
import { http } from "../../../utils/http";
import AllowPermission from "../../../components/layout/AllowPermission.vue";
import { PERMISSION_CODES } from "../../../store/permission";

export default {
  components: {
    AllowPermission,
    Card,
    SelectDropdown,
    Button,
    CustomInput,
  },
  data() {
    return {
      fromWarehouseId: "",
      toWarehouseId: "",
      warehouseRoom: "",
      eta: null,
      notes: "",
      processing: false,
      PERMISSION_CODES,
    };
  },
  computed: {
    ...mapState("misc", ["warehouseRooms", "warehouses"]),
    warehouseSelectOptions() {
      return this.warehouses.map((item) => ({
        ...item,
        title: `${item.name} (${item.crol_number || "NA"})`,
      }));
    },
  },
  methods: {
    async createTransfer() {
      if (this.processing) return;
      if (!this.warehouseRoom || !this.fromWarehouseId || !this.toWarehouseId) {
        return this.$toast.error("Please fill up mandatory fields marked *");
      }
      if (this.fromWarehouseId == this.toWarehouseId) {
        return this.$toast.error("Source and destination warehouses must be different!");
      }
      this.processing = true;
      try {
        const res = await http.post("/stock-transfers", {
          from_front_room: this.warehouseRoom === this.warehouseRooms.FRONT_ROOM.id,
          from_warehouse_id: this.fromWarehouseId,
          to_warehouse_id: this.toWarehouseId,
          eta: this.eta,
          notes: this.notes || "",
        });
        this.$toast.success("New Stock Transfer Created!");
        this.$router.push(`/stock-transfers/${res.data.result.id}`);
      } catch (err) {
        console.log("error in transferring", err);
        this.$toast.error(errMsg(err, "Error in creating transfer!"));
      }
      this.processing = false;
    },
  },
};
</script>

<style></style>
