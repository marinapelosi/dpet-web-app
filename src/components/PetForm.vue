<template>
  <div class="background">
      <header class="header">
        <img src="/img/docupet-logo-2x.png" alt="Docupet Logo" width="200"/>
      </header>      
      <div class="pet-form">
        <div class="paw-track">
          <v-icon class="paw-step" :class="pawClass(1)">mdi-paw</v-icon>
          <v-icon class="paw-step paw-right" :class="pawClass(1)">mdi-paw</v-icon>
          <v-icon class="paw-step" :class="pawClass(2)">mdi-paw</v-icon>
          <v-icon class="paw-step paw-right" :class="pawClass(2)">mdi-paw</v-icon>
          <v-icon class="paw-step" :class="pawClass(3)">mdi-paw</v-icon>
          <v-icon class="paw-step paw-right" :class="pawClass(3)">mdi-paw</v-icon>
          <v-icon class="paw-step" :class="pawClass(4)">mdi-paw</v-icon>
        </div>
        <br /><br />
        <div v-if="step === 1">
          <h2>Let's begin with your <br />Pet Registration!</h2>        
          <br /><br />
          <v-select
            v-model="selectedPetTypeOption"
            label="What type is your pet?"
            :items="petTypes"
            item-title="name"
            item-value="slug"
            variant="solo"         
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <v-icon class="mr-2">mdi-{{ item.raw.slug }}</v-icon>                
              </v-list-item>
            </template>

            <template v-slot:selection="{ item }">
              <v-icon class="mr-2">mdi-{{ item.raw.slug }}</v-icon>
              {{ item.raw.name }}
            </template>
          </v-select>
          <v-btn append-icon="mdi-arrow-right" variant="flat" color="info" @click="nextStep" :disabled="!isStepValid">
            Continue
          </v-btn>
          <br />
          <v-btn prepend-icon="mdi-close" variant="flat" color="error"  @click="backToPetList">
            Cancel
          </v-btn>
        </div>

        <div v-if="step === 2">
          <h2>Tell us about your {{ newPet.pet_type }}</h2>        
          <br />
          <v-text-field
            v-model="newPet.name"
            :label="`What is your ${newPet.pet_type}'s name?`"
            variant="solo"
          ></v-text-field>

          <v-autocomplete
            v-model="selectedBreedOption"
            :items="[ { id: null, name: `Can't find it?` }, ...breeds ]"
            item-title="name"
            item-value="id"
            label="What breed are they?"
            variant="solo"
            append-inner-icon="mdi-magnify"
            :menu-props="{ offsetY: true }"
            return-object
          >
          </v-autocomplete>

          <v-radio-group
            v-if="selectedBreedOption && selectedBreedOption.id === null"
            v-model="selectedOtherBreedOption" 
            label="Choose One"
          >
            <v-radio
              label="I don't know"
              value="unknown"              
              v-model="newPet.is_unknown_breed"
              @change="handleRadioSelection('unknown')"
            ></v-radio>

            <v-radio
              label="It's a mix"
              value="mix"
              v-model="newPet.is_mixed_breed"
              @change="handleRadioSelection('mix')"
            ></v-radio>
            
            <v-text-field
              v-if="newPet.is_mixed_breed"
              v-model="newPet.mixed_breed_description"              
              label="Describe the mix"
              variant="outlined"
            ></v-text-field>
          </v-radio-group>  
          
          <div align="left">
            <v-label style="font-size:14px; color: #111111;"><b>What gender are they?</b></v-label><br />
            <v-btn-toggle v-model="newPet.gender" color="info">
              <v-btn value="female">Female</v-btn>
              <v-btn value="male">Male</v-btn>
            </v-btn-toggle>
          </div>          

          <br /><br />
          <v-btn prepend-icon="mdi-arrow-left" variant="flat" @click="previousStep" :disabled="!newPet.pet_type">
            Back
          </v-btn>
          <v-btn append-icon="mdi-arrow-right" variant="flat" color="info" @click="nextStep" :disabled="!isStepValid">
            Continue
          </v-btn>
          <br />
          <v-btn prepend-icon="mdi-close" variant="flat" color="error"  @click="backToPetList">
            Cancel
          </v-btn>
        </div>   
        
        <div v-if="step === 3">
          <h2>Tell us about your {{ newPet.pet_type }}</h2>        
          <br />          
          
          <div align="left">
            <v-label style="font-size:14px; color: #111111;"><b>Do you know their date of birth?</b></v-label><br />
            <v-btn-toggle v-model="whatShowAboutBirthDate" color="info">
              <v-btn value="datepicker">Yes</v-btn>
              <v-btn value="approximate_age">No</v-btn>
            </v-btn-toggle>
          </div>    
          <br />                      
 
          <v-text-field
            v-if="whatShowAboutBirthDate == 'datepicker'"
            v-model="newPet.birth_date"
            label="Data"
            type="date"
            variant="solo"
            :max="new Date().toISOString().split('T')[0]"
          ></v-text-field>       

          <v-select
            v-if="whatShowAboutBirthDate == 'approximate_age'"
            v-model="newPet.approximate_age"
            :items="Array.from({ length: 20 }, (_, i) => i + 1) "
            label="Approximate age (years old)"
            variant="solo"
          />    

          <br /><br />
          <v-btn prepend-icon="mdi-arrow-left" variant="flat" @click="previousStep" :disabled="!newPet.pet_type">
            Back
          </v-btn>
          <v-btn append-icon="mdi-arrow-right" variant="flat" color="info" @click="savePet" :disabled="!isStepValid">
            Finish and Save
          </v-btn>
          <br />
          <v-btn prepend-icon="mdi-close" variant="flat" color="error"  @click="backToPetList">
            Cancel
          </v-btn>
        </div>
        <div v-if="step === 4">
          <div align="center">            
            <v-icon :icon="'mdi-' + petCreated.pet_type.slug" style="font-size:100px" :color="petCreated.gender.toLowerCase() === 'female' ? 'pink' : 'blue'"></v-icon>
          </div>
          <br />
          <v-list-item-title>
            <b>{{ petCreated.name }}</b>, {{ petCreated.approximate_age }} yo 
            <span v-if="petCreated.birth_date" style="font-size:12px"><b><i>(Born in {{ petCreated.birth_date }})</i></b></span>
            <span v-else style="font-size:12px"><b><i>approximated</i></b></span>
          </v-list-item-title>
          <br />
          <v-chip v-if="petCreated.gender" :color="petCreated.gender.toLowerCase() === 'female' ? 'pink' : 'blue'" >
            <v-icon 
              :icon="'mdi-gender-' + petCreated.gender.toLowerCase()"             
              size="x-large">
            </v-icon>
          </v-chip>         
          
          <v-chip v-if="petCreated.breed" :color="(petCreated.breed.is_dangerous) ? 'error' : 'default'">
              <v-icon v-if="petCreated.breed.is_dangerous" icon="mdi-alert" size="x-large"></v-icon>
              {{ petCreated.breed.name }}
          </v-chip>  
          
          <v-chip v-if="petCreated.is_unknown_breed" color="warning">
              <v-icon icon="mdi-help" size="x-large"></v-icon>
              Unknown Breed
          </v-chip>  

          <v-chip v-if="petCreated.is_mixed_breed" color="warning">
              <v-icon icon="mdi-recycle" size="x-large"></v-icon>
              Mixed breed: <b>{{ petCreated.mixed_breed_description }}</b>
          </v-chip> 

          <br /><br />
          <v-btn prepend-icon="mdi-repeat" variant="flat" @click="startOver">
            Add another pet
          </v-btn>
          <v-btn append-icon="mdi-arrow-right" variant="flat" color="info" @click="backToPetList">
            Back to the list
          </v-btn>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ApiService from "@/services/api";
  import { API_ROUTES } from "@/services/apiRoutes";
  import Swal from 'sweetalert2';

  export default {
    data() {
      return {
        petTypes: [],
        selectedPetTypeOption: null,
        selectedBreedOption: '',
        selectedOtherBreedOption: null,
        whatShowAboutBirthDate: 'nothing_for_now_wait_user_select',
        breeds: [],
        step: 1,
        newPet: { 
          pet_type: '',
          breed: '',  
          name: '',                    
          is_unknown_breed: false, 
          is_mixed_breed: false,
          mixed_breed_description: '',
          birth_date: '',
          approximate_age: '',
          gender: '', 
        },         
        petCreated: {},
      };
    },
    mounted() {
      this.fetchPetTypes();
    },
    async created() {
        try {
            const response = await this.fetchPetTypes();
            if (Array.isArray(response.data)) {
                this.petTypes = response.data;
            } else {
                console.error("Unexpected error:", response.data);
                this.petTypes = [];
            }
        } catch (error) {
            console.error("Error looking:", error);
            this.petTypes = [];
        }
    },
    computed: {
      isStepValid() {
        switch (this.step) {
          case 1:
            return !!this.newPet.pet_type;          
          case 2:
            return (this.newPet.name && this.newPet.gender && (this.newPet.breed || this.newPet.is_unknown_breed || (this.newPet.is_mixed_breed && this.newPet.mixed_breed_description)));
          case 3:
            return (this.newPet.birth_date || this.newPet.approximate_age);
          case 4:
            return true;
          default:
            return false;
        }
      }
    },
    methods: {

      backToPetList() {
        if (this.step >= 2 && this.step < 4) {
          Swal.fire({
            title: "Are you sure?",
            text: "Your progress will be lost!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, cancel",
            cancelButtonText: "No, keep going"
          }).then((result) => {
            if (result.isConfirmed) {
              this.$router.push('/');
            }
          });
        } else {
          this.$router.push('/');
        }
      },

      startOver() {
          location.reload();     
      },

      pawClass(stepNumber) {
        if (this.step === stepNumber) {
          return this.isStepValid ? "active" : "error";
        }
        return stepNumber < this.step ? "active" : "faded";
      },

      async fetchPetTypes() {
        try {
          const response = await ApiService.get(API_ROUTES.PET_TYPES);
          return response;
        } catch (error) {
          console.error("Error during pets type list api:", error);
        }
      },

      async fetchBreeds() {
        try {
          const response = await ApiService.get(API_ROUTES.BREED_BY_PET_TYPE(this.newPet.pet_type));     
          return response;
        } catch (error) {
          console.error("Error during breeds list api", error);
        }
      },

      previousStep() {
        this.step--;
      },

      nextStep() {
        this.step++;
      },

      handleBreedSelection() {
        if (this.newPet.breed !== "Can't find it?") {
          this.newPet.is_unknown_breed = false;
          this.newPet.is_mixed_breed = false;
        }
      },

      handleRadioSelection(option) {
        this.selectedOtherBreedOption = option;
        this.resetBreedSelect;
        if (option === "unknown") {          
          this.resetIsMixBreedOption();
          this.markIsUnknownBreedOption();
        } else if (option === "mix") {
          this.resetIsUnknownBreedOption();
          this.markIsMixBreedOption();
        }
      },

      markIsUnknownBreedOption() {   
        this.newPet.is_unknown_breed = true;
      },

      resetIsUnknownBreedOption() {   
        this.newPet.is_unknown_breed = false;
      },

      markIsMixBreedOption() {   
        this.newPet.is_mixed_breed = true;
      },

      resetIsMixBreedOption() {   
        this.newPet.is_mixed_breed = false;
        this.newPet.mixed_breed_description = null;
      },

      resetBreedSelect() {   
        this.newPet.breed = null;
      },

      async savePet() {
        try {

          const petData = { ...this.newPet };

          const response = await ApiService.post(API_ROUTES.PETS, petData);
          
          if (response.data) {            
            this.petCreated = response.data;
            Swal.fire({
              icon: 'success',
              title: 'Welcome to our family '+this.petCreated.name+'!',
              text: response.message
            });
            this.step++;
          }          

        } catch (error) {
          console.error('Unexpected error while saving pet: ', error);
        }
      }
    },
    watch: {
      async step(newValue, oldValue) {   
         
        if (newValue == 2 && oldValue == 1) {
          try {
            const response = await this.fetchBreeds();
            
            if (Array.isArray(response.data)) {          
              this.breeds = response.data
            } else {
              console.error("Unexpected error:", response.data);
              this.breeds = [];
            }
          } catch (error) {
            console.error("Error looking:", error);
            this.breeds = [];
          }
        }        
      },
      selectedPetTypeOption(newValue, oldValue) {
        this.newPet.pet_type = newValue;

        if (newValue != oldValue) {
          this.resetBreedSelect();
          this.resetIsMixBreedOption();
          this.resetIsUnknownBreedOption();
          this.selectedBreedOption = '';
          this.selectedOtherBreedOption = '';
        }
      },
      selectedBreedOption(newValue) {
        if (newValue != null) {
          this.newPet.breed = newValue.id;
        }
                
        if (newValue === null) {
          this.newPet.breed = newValue;          
        }

        this.resetIsUnknownBreedOption();
        this.resetIsMixBreedOption();
        this.selectedOtherBreedOption = null;
      },
      whatShowAboutBirthDate(newValue) {
        if (newValue == 'datepicker') {
          this.newPet.approximate_age = null;
        }

        if (newValue == 'approximate_age') {
          this.newPet.birth_date = null;
        }
      }
      
    }

  };
  </script>
  
  <style>
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

  .pet-form {
    margin-top: 50px;
    width: 100%;
    max-width:450px;
    padding: 50px;
    margin: auto;
    text-align: center;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  button {
    margin-top: 10px;
  }

  h2 {
    color: #00488f;
    font-weight: bold;
    font-size: 18px;
    font-family: Arial, sans-serif;
    text-align: left
  }

  .paw-track {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .paw-step {
    font-size: 30px;
    transform: rotate(90deg);
  }

  .paw-right {
    margin-top: 20px;
  }

  .active {
    color: green;
  }

  .error {
    color: rgb(177, 3, 3);
  }

  .faded {
    color: lightgray;
    opacity: 0.4;
  }
  </style>