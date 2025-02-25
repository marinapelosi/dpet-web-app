<template>
    <div class="background">
      <header class="header">
        <img src="/img/docupet-logo-2x.png" alt="Docupet Logo" width="200"/>
      </header>
  
      <div class="content-container">
        <h4 class="text-center my-4">Pet List</h4>

        <v-btn prepend-icon="mdi-plus" variant="outlined" @click="openFormRegistration">
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
                        <v-icon :icon="'mdi-' + pet.pet_type.slug" style="font-size: 50px" :color="pet.gender.toLowerCase() === 'female' ? 'pink' : 'blue'"></v-icon>
                    </template>

                    <v-list-item-title>
                    {{ pet.name }}, {{ pet.approximate_age }} yo 
                    <span v-if="pet.birth_date" style="font-size:12px"><b><i>(Born in {{ pet.birth_date }})</i></b></span>
                    <span v-else style="font-size:12px"><b><i>approximated</i></b></span>
                    </v-list-item-title>
                    <v-chip v-if="pet.gender" :color="pet.gender.toLowerCase() === 'female' ? 'pink' : 'blue'" >
                        <v-icon 
                        :icon="'mdi-gender-' + pet.gender.toLowerCase()"             
                        size="x-large">
                        </v-icon>
                    </v-chip>         
                    
                    <v-chip v-if="pet.breed" :color="(pet.breed.is_dangerous) ? 'error' : 'default'">
                        <v-icon v-if="pet.breed.is_dangerous" icon="mdi-alert" size="x-large"></v-icon>
                        {{ pet.breed.name }}
                    </v-chip>

                    <v-chip v-if="pet.is_unknown_breed" color="warning">
                        <v-icon icon="mdi-help" size="x-large"></v-icon>
                        Unknown Breed
                    </v-chip>

                    <v-chip v-if="pet.is_mixed_breed" color="warning">
                        <v-icon icon="mdi-recycle" size="x-large"></v-icon>
                        Mixed breed: <b>{{ pet.mixed_breed_description }}</b>
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
            const response = await this.fetchPets();
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
          const response = await ApiService.get(API_ROUTES.PETS);
          return response;
        } catch (error) {
          console.error("Erro ao buscar pets:", error);
        }
      },
      openFormRegistration() {
        this.$router.push('/form');
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

  h4 {
    color: #003366;
    font-weight: bold;
    font-size: 18px;
    font-family: Arial, sans-serif;
    }
 
  </style>
  