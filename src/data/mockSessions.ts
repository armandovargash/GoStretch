import { StretchSession } from '../types';

export const mockSessions: StretchSession[] = [
    {
        id: "full-body-001",
        name: "Full Body Release",
        overview: "Relaja todo el cuerpo en 3 minutos. Perfecto para empezar el día o soltar tensión acumulada en la oficina.",
        createdAt: new Date().toISOString(),
        stretches: [
            {
                id: "stretch-001",
                nameKey: "Estiramiento de Cuello",
                detailKey: "Inclina suavemente la cabeza hacia un lado.",
                duration: 30,
                animationName: "neck_stretch", // Used by Nano Banana later
                orderIndex: 0
            },
            {
                id: "stretch-002",
                nameKey: "Giros de Hombros",
                detailKey: "Rota los hombros hacia atrás, abriendo el pecho.",
                duration: 30,
                animationName: "shoulder_rolls",
                orderIndex: 1
            },
            {
                id: "stretch-003",
                nameKey: "Inclinación Lateral",
                detailKey: "Estira el brazo sobre la cabeza y flexiona el torso lateralmente.",
                duration: 30,
                animationName: "side_bend",
                orderIndex: 2
            },
            {
                id: "stretch-004",
                nameKey: "Extensión de Espalda",
                detailKey: "Manos en la cadera baja, empuja suavemente la pelvis hacia adelante.",
                duration: 30,
                animationName: "back_extension",
                orderIndex: 3
            },
            {
                id: "stretch-005",
                nameKey: "Estiramiento Isquiotibiales",
                detailKey: "Pierna estirada al frente, inclínate ligeramente manteniendo la espalda recta.",
                duration: 30,
                animationName: "hamstring_stretch",
                orderIndex: 4
            },
            {
                id: "stretch-006",
                nameKey: "Estiramiento de Cuádriceps",
                detailKey: "Lleva el talón hacia el glúteo manteniendo las rodillas juntas.",
                duration: 30,
                animationName: "quad_stretch",
                orderIndex: 5
            }
        ]
    }
];
