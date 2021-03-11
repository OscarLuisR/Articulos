<template>
    <div>
        <v-app>
            <v-main>
                <v-card class="mx-auto mt-5" color="transparent" max-width="1280" elevation="0">
                    <!-- BOTON -->
                    <v-btn class="mx-2" fab dark color="#e040fb" @click="formNuevo">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>

                    <!-- TABLA -->
                    <v-simple-table class="mt-5">
                        <template v-slot:default>
                            <thead>
                                <tr class="purple darken-2">
                                    <th class="white--text">ID</th>
                                    <th class="white--text">DESCRIPCION</th>
                                    <th class="white--text">DEPARTAMENTO</th>
                                    <th class="white--text text-right">PRECIO</th>
                                    <th class="white--text text-right">STOCK</th>
                                    <th class="white--text">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="articulo in articulos" :key="articulo.id">
                                    <td>{{ articulo.id }}</td>
                                    <td>{{ articulo.descripcion }}</td>
                                    <td>{{ articulo.departamento }}</td>
                                    <td class="text-right">{{ articulo.precio }}</td>
                                    <td class="text-right">{{ articulo.stock }}</td>
                                    <td>
                                        <v-btn 
                                            class="mr-4"
                                            color="pink" dark fab small 
                                            @click="formEditar(articulo.id, articulo.descripcion, articulo.departamento, articulo.precio, articulo.stock)">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                        
                                        <v-btn 
                                            color="error" dark fab small 
                                            @click="eliminar(articulo.id)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>

                    <!-- PAGINACION -->
                    <div class="text-center">
                        <v-container>
                            <v-row justify="center">
                                <v-col cols="8">
                                    <v-container class="max-width">
                                        <v-pagination
                                            v-model="page"
                                            class="my-4"
                                            :length="totalPages"
                                            :total-visible="(totalPages >= 10 ? 11: totalPages)"
                                        ></v-pagination>
                                    </v-container>
                                </v-col>
                            </v-row>
                        </v-container>
                    </div>
                    <!-- PAGINACION -->

                    <!-- FORMULARIO -->
                    <v-dialog v-model="dialog" max-width="500">
                        <v-card>
                            <v-card-title class="purple darken-4 white--text">Articulo</v-card-title>
                            
                            <v-card-text>
                                <v-form ref="formDatos" v-model="valid"> 
                                    <v-container>
                                        <v-row>
                                            <input type="text" v-model="id" hidden>

                                            <v-col cols="12">
                                                <v-text-field v-model="descripcion" label="Descripcion" :rules="[rules.required]"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field v-model="departamento" label="Departamento" :rules="[rules.required]"></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field v-model="precio" label="Precio" type="number" prefix="$" :rules="[rules.required, rules.minValue]"></v-text-field>                                            
                                            </v-col>
                                        </v-row>                                        

                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field v-model="stock" label="Stock" type="number" :rules="[rules.required, rules.minValue]"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>

                                        <v-btn @click="cancelar" color="blue-grey" dark>Cancelar</v-btn>
                                        <v-btn @click="guardar" class="white--text" :disabled="!valid" color="#e040fb">Guardar</v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-card>
            </v-main>
        </v-app>
    </div>
</template>

<script>
    import articuloService from '../services/api/articuloService';
    import alertService from '../services/alert/alertService';

    export default {
        name: 'ListadoArticulos',
        data() {
            return {
                valid: false,
                dialog: false,
                operacion: '',
                articulos: [],
                id: null,
                descripcion: null,                
                departamento: null,                
                precio: null,                
                stock: null,
                // descripcionRules: [v => !!v || 'Descripcion is required'],
                // departamentoRules: [v => !!v || 'Departamento is required'],
                // precioRules: [v => !!v || 'Precio is required', v => v > 0 || "Precio debe ser mayor a cero (0)"],
                // stockRules: [v => !!v || 'Stock is required', v => v > 0 || "Stock debe ser mayor a cero (0)"],
                rules: {
                    required: value => !!value || "Required.",
                    minValue: v => (v > 0) || "Precio debe ser mayor a cero (0).",
                },
                page: 1,
                // paginationMin: 1,
                // paginationMax: 10,
                // paginacion: [],
                // hasNextPage: false,
                // hasPrevPage: false,
                totalPages: 0
            }
        },

        watch: {
            page: function (val) {
                this.mostrarArticulos();
            }
        },

        methods: {
            // ACCIONES DE LOS BOTONES DEL FORMULARIO
            limpiarDatos(){
                this.id = null;
                this.descripcion = null;
                this.departamento = null;
                this.precio = null;
                this.stock = null;

                this.valid = false;
            },

            formNuevo() {                
                this.limpiarDatos();

                this.dialog = true;
                this.operacion = 'crear';
            },

            formEditar(id, descripcion, departamento, precio, stock) {
                this.limpiarDatos();

                this.dialog = true;
                this.operacion = 'editar';
                
                this.id = id;
                this.descripcion = descripcion;
                this.departamento = departamento;
                this.precio = precio;
                this.stock = stock;
            },

            guardar() {
                if (this.$refs.formDatos.validate()) {
                    if (this.operacion == 'crear'){
                        this.crear();
                    }else {
                        this.editar();
                    }
    
                    this.dialog = false;
                    this.$refs.formDatos.reset();
                }
            },

            cancelar() {
                this.dialog = false;
                this.$refs.formDatos.reset();
            },

            // ACCIONES PARA EL CRUD DE LA API
            async mostrarArticulos() {
                try {
                    const res = await articuloService.get(`?page=${this.page}`);

                    this.articulos = res.data.results['docs'];

                    // PAGINACION
                    // this.paginacion = res.data.results.pagination;
                    // this.hasNextPage = res.data.results.hasNextPage;
                    // this.hasPrevPage = res.data.results.hasPrevPage;
                    // this.paginationMin = res.data.results.pagination[0];
                    // this.paginationMax = res.data.results.pagination[res.data.results.pagination.length-1]
                    this.totalPages = res.data.results.totalPages;

                } catch (err) {
                    console.log(err);
                }
            },

            async crear() {
                try {
                    let articulo = {
                        descripcion: this.descripcion, 
                        departamento: this.departamento,
                        precio: this.precio, 
                        stock: this.stock 
                    }

                    const res = await articuloService.post('', articulo);

                    if (res.data.error) {
                        // Mensaje Error
                        alertService.muestraAlerta('error', 'Oops...', res.data.message);

                    }else {
                        // Mensaje Ok
                        alertService.muestraAlerta('success', 'Hecho', 'Articulo Creado con Exito');

                        this.mostrarArticulos();

                        this.limpiarDatos();
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            async editar() {
                try {
                    let articulo = {
                        descripcion: this.descripcion, 
                        departamento: this.departamento,
                        precio: this.precio, 
                        stock: this.stock 
                    }

                    const res = await articuloService.put(`${this.id}`, articulo);

                    if (res.data.error) {
                        // Mensaje Error
                        alertService.muestraAlerta('error', 'Oops...', res.data.message);
                    }else {
                        // Mensaje Ok
                        alertService.muestraAlerta('success', 'Hecho', 'Articulo Actualizado con Exito');
                        
                        this.mostrarArticulos();

                        this.limpiarDatos();
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            async eliminar(id) {
                alertService.muestraConfirmacion('question', 'Desea Eliminar el Registro?').then( async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const res = await articuloService.delete(`${id}`);

                            if (res.data.error) {
                                // Mensaje Error
                                alertService.muestraAlerta('error', 'Oops...', res.data.message);
                            }else {
                                // Mensaje Ok
                                alertService.muestraAlerta('success', 'Hecho', 'Articulo Eliminado con Exito');
                                
                                this.mostrarArticulos();

                                this.limpiarDatos();
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                });
            }
        },
        mounted() {
            this.mostrarArticulos();
        },
    }
</script>

<style scoped>
    
</style>