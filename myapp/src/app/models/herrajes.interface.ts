export interface Mueble {
    id:            number;
    nombre:        string;
    imagen:        string;
    numero_piezas: number;
    herrajes:      Herraje[];
}

export interface Herraje {
    id:       number;
    tipo:     string;
    cantidad: number;
}