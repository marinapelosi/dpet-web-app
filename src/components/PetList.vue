<template>
    <div class="background">
      <header class="header">
        <img src="/img/docupet-logo-2x.png" alt="Docupet Logo" width="200"/>
      </header>
  
      <div class="content-container">
        <h4 class="text-center my-4">Pet List</h4>

        <v-btn prepend-icon="mdi-plus" variant="outlined">
            Register new pet
        </v-btn>
        <v-card
            class="mx-auto pa-2"
            max-width="800"
            style="box-shadow:none"
        >
            <v-list lines="three">               
                <v-list-item
                    v-for="pet in pets"
                    :key="pet.id"
                    color="primary"
                    rounded="xl"
                    style="border: 1px solid #cccccc; margin-top: 5px; text-align: left"
                >
                    <template v-slot:prepend>
                    <v-icon icon="mdi-dog" style="font-size: 50px"></v-icon>
                    </template>

                    <v-list-item-title>{{ pet.name }}, {{ pet.approximate_age }} yo</v-list-item-title>

                    <v-chip color="error">
                        <v-icon icon="mdi-alert" size="x-large"></v-icon>
                        Dangerous
                    </v-chip>
                </v-list-item>
            </v-list>
        </v-card>
      </div>
    </div>
  </template>
  
  <script>
  import ApiService from "@/services/api";
  import { API_ROUTES } from "@/services/apiRoutes";

  
  export default {
    data() {
      return {        
        pets: []
      };
    },
  
    async created() {
        try {
            const response = await ApiService.get("/pets");
            if (Array.isArray(response.data)) {
                this.pets = response.data;
            } else {
                console.error("Unexpected error:", response.data);
                this.pets = [];
            }
        } catch (error) {
            console.error("Error looking:", error);
            this.pets = [];
        }
    },

    methods: {
      async fetchPets() {
        try {
          const data = await ApiService.get(API_ROUTES.PETS);
          this.pets = data;
        } catch (error) {
          console.error("Erro ao buscar pets:", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  
  .background {
    background-color: #cccccc;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: white;
    padding: 15px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .content-container {
    background-color: white;
    width: 90%;
    max-width: 1200px;
    margin-top: 100px;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
 
  </style>
  