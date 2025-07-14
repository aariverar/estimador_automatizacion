// Interfaces para el sistema de estimación QA

export interface EstimationForm {
  nombreCasoPrueba: string
  tipoComplejidad: 'Muy Baja' | 'Baja' | 'Media' | 'Alta' | 'Muy Alta' | ''
  tiempoAnalisisPreparacion: number
  tiempoDesarrollo: number
  tiempoEjecucionDepuracion: number
  tiempoMantenimientoRefactorizacion: number
  tiempoIntegracionVerificacion: number
  tiempoDocumentacionResguardo: number
  descripcionCaso: string
  tecnologias: string[]
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica' | ''
  fechaCreacion?: Date
  id?: string
}

export interface ComplejidadConfig {
  'Muy Baja': TimeDistribution
  Baja: TimeDistribution
  Media: TimeDistribution
  Alta: TimeDistribution
  'Muy Alta': TimeDistribution
}

export interface TimeDistribution {
  analisisPreparacion: number
  desarrollo: number
  ejecucionDepuracion: number
  mantenimientoRefactorizacion: number
  integracionVerificacion: number
  documentacionResguardo: number
}

export interface EstimationSummary {
  tiempoTotal: number
  tiempoPorActividad: TimeDistribution
  complejidad: string
  prioridad: string
}

export interface ExportOptions {
  includeHeader: boolean
  includeResumen: boolean
  formato: 'excel' | 'pdf' | 'word'
  nombreArchivo?: string
}

export interface EstimationStatistics {
  totalCasos: number
  tiempoTotalProyecto: number
  tiempoPromedio: number
  distribicionComplejidad: {
    alta: number
    media: number
    baja: number
  }
  distribicionPrioridad: {
    critica: number
    alta: number
    media: number
    baja: number
  }
}

export type ComplejidadType = 'Baja' | 'Media' | 'Alta'
export type PrioridadType = 'Baja' | 'Media' | 'Alta' | 'Crítica'
