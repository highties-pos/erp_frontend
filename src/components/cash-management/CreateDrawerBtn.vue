<template>
    <div>
        <Button @click="showModal = true" condensed noMargin borderOnly>New Drawer</Button>
        <CustomModal
            v-if="showModal"
            :title="`New Drawer`"
            :show="showModal"
            @close="showModal = false"
        >
            <div class="my-3 inventory-move-modal-inner">
                <div>
                    <div class="row">
                        <div class="col-md-12">
                            <CustomInput
                                v-model="name"
                                placeholder="Enter Name"
                                type="text"
                                :label="`Drawer Name*`"
                            />
                        </div>
                        <div class="col-md-12">
                            <CustomInput
                                v-model="description"
                                placeholder="Enter Description"
                                type="text"
                                :label="`Description`"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex" style="gap: 10px">
                            <Button @click="showModal = false">Cancel</Button>
                            <Button @click="createDrawer">
                                <i class="fas fa-plus"></i>
                                {{ creating ? "Please wait..." : "Create" }}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </CustomModal>
    </div>
</template>

<script>
import CustomInput from "../crud/custom-input.vue"
import CustomModal from "../layout/CustomModal.vue"
import Button from "../UI/Button.vue"
import CashManagementFetchApi from "@/utils/fetch/cash-management-fetch-api"
import { errMsg } from "../../utils/common"

export default {
    emits: ["created"],
    data() {
        return {
            showModal: false,
            creating: false,
            name: "",
            description: "",
        }
    },
    props: { parent: String },
    components: { CustomInput, Button, CustomModal },
    methods: {
        async createDrawer() {
            if (this.creating) return
            if (!this.name) {
                this.$toast.error("Please enter a name!")
                return;
            }
            this.creating = true
            try {
                const result = await CashManagementFetchApi.createDrawer({
                    parent: this.parent,
                    name: this.name,
                    description: this.description,
                })
                this.$emit("created", result)
                this.$toast.success("Drawer created successfully")
                this.showModal = false
            } catch (err) {
                this.$toast.error(errMsg(err, "Could not create drawer"))
            }
            this.creating = false
        },
    },
    watch: {
        showModal(e) {
            this.name = ""
            this.description = ""
        },
    },
}
</script>

<style></style>
