import { utils, writeFile } from 'xlsx'
import type { EstimationForm } from '../types/estimation'

export const exportToExcel = (estimaciones: EstimationForm[], nombreArchivo: string = 'estimaciones_qa') => {
  try {
    // Preparar datos para Excel
    const datosExcel = estimaciones.map((estimacion, index) => {
      const tiempoTotal = estimacion.tiempoAnalisisPreparacion + estimacion.tiempoDesarrollo + 
                         estimacion.tiempoEjecucionDepuracion + estimacion.tiempoMantenimientoRefactorizacion + 
                         estimacion.tiempoIntegracionVerificacion + estimacion.tiempoDocumentacionResguardo

      return {
        'N°': index + 1,
        'Nombre del Caso': estimacion.nombreCasoPrueba,
        'Complejidad': estimacion.tipoComplejidad,
        'Prioridad': estimacion.prioridad,
        'Tiempo Análisis y Preparación (h)': estimacion.tiempoAnalisisPreparacion,
        'Tiempo Desarrollo (h)': estimacion.tiempoDesarrollo,
        'Tiempo Ejecución y Depuración (h)': estimacion.tiempoEjecucionDepuracion,
        'Tiempo Mantenimiento y Refactorización (h)': estimacion.tiempoMantenimientoRefactorizacion,
        'Tiempo Integración y Verificación (h)': estimacion.tiempoIntegracionVerificacion,
        'Tiempo Documentación y Resguardo (h)': estimacion.tiempoDocumentacionResguardo,
        'Tiempo Total (h)': tiempoTotal,
        'Descripción': estimacion.descripcionCaso
      }
    })

    // Crear resumen estadístico
    const totalCasos = estimaciones.length
    const tiempoTotalProyecto = estimaciones.reduce((acc, est) => 
      acc + est.tiempoAnalisisPreparacion + est.tiempoDesarrollo + est.tiempoEjecucionDepuracion + 
      est.tiempoMantenimientoRefactorizacion + est.tiempoIntegracionVerificacion + est.tiempoDocumentacionResguardo, 0)
    
    const promedioTiempo = totalCasos > 0 ? tiempoTotalProyecto / totalCasos : 0
    
    const casosMuyAltaComplejidad = estimaciones.filter(e => e.tipoComplejidad === 'Muy Alta').length
    const casosAltaComplejidad = estimaciones.filter(e => e.tipoComplejidad === 'Alta').length
    const casosMediaComplejidad = estimaciones.filter(e => e.tipoComplejidad === 'Media').length
    const casosBajaComplejidad = estimaciones.filter(e => e.tipoComplejidad === 'Baja').length
    const casosMuyBajaComplejidad = estimaciones.filter(e => e.tipoComplejidad === 'Muy Baja').length

    const resumen = [
      { 'Métrica': 'Total de Casos', 'Valor': totalCasos },
      { 'Métrica': 'Tiempo Total del Proyecto (h)', 'Valor': tiempoTotalProyecto.toFixed(1) },
      { 'Métrica': 'Tiempo Promedio por Caso (h)', 'Valor': promedioTiempo.toFixed(1) },
      { 'Métrica': 'Casos Muy Alta Complejidad', 'Valor': casosMuyAltaComplejidad },
      { 'Métrica': 'Casos Alta Complejidad', 'Valor': casosAltaComplejidad },
      { 'Métrica': 'Casos Media Complejidad', 'Valor': casosMediaComplejidad },
      { 'Métrica': 'Casos Baja Complejidad', 'Valor': casosBajaComplejidad },
      { 'Métrica': 'Casos Muy Baja Complejidad', 'Valor': casosMuyBajaComplejidad }
    ]

    // Crear libro de trabajo
    const wb = utils.book_new()

    // Hoja de estimaciones detalladas
    const wsEstimaciones = utils.json_to_sheet(datosExcel)
    utils.book_append_sheet(wb, wsEstimaciones, 'Estimaciones Detalladas')

    // Hoja de resumen
    const wsResumen = utils.json_to_sheet(resumen)
    utils.book_append_sheet(wb, wsResumen, 'Resumen Ejecutivo')

    // Generar y descargar archivo
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-')
    const fileName = `${nombreArchivo}_${timestamp}.xlsx`
    
    writeFile(wb, fileName)
    
    return {
      success: true,
      fileName,
      message: `Archivo ${fileName} exportado exitosamente`
    }
  } catch (error) {
    console.error('Error al exportar a Excel:', error)
    return {
      success: false,
      message: 'Error al generar el archivo Excel',
      error
    }
  }
}

export const exportCurrentEstimation = (estimacion: EstimationForm) => {
  const tiempoTotal = estimacion.tiempoAnalisisPreparacion + estimacion.tiempoDesarrollo + 
                     estimacion.tiempoEjecucionDepuracion + estimacion.tiempoMantenimientoRefactorizacion + 
                     estimacion.tiempoIntegracionVerificacion + estimacion.tiempoDocumentacionResguardo

  const datosExcel = [{
    'Nombre del Caso': estimacion.nombreCasoPrueba,
    'Complejidad': estimacion.tipoComplejidad,
    'Prioridad': estimacion.prioridad,
    'Tiempo Análisis y Preparación (h)': estimacion.tiempoAnalisisPreparacion,
    'Tiempo Desarrollo (h)': estimacion.tiempoDesarrollo,
    'Tiempo Ejecución y Depuración (h)': estimacion.tiempoEjecucionDepuracion,
    'Tiempo Mantenimiento y Refactorización (h)': estimacion.tiempoMantenimientoRefactorizacion,
    'Tiempo Integración y Verificación (h)': estimacion.tiempoIntegracionVerificacion,
    'Tiempo Documentación y Resguardo (h)': estimacion.tiempoDocumentacionResguardo,
    'Tiempo Total (h)': tiempoTotal,
    'Descripción': estimacion.descripcionCaso,
    'Fecha Estimación': new Date().toLocaleDateString('es-ES')
  }]

  const wb = utils.book_new()
  const ws = utils.json_to_sheet(datosExcel)
  utils.book_append_sheet(wb, ws, 'Estimación')

  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-')
  const fileName = `estimacion_${estimacion.nombreCasoPrueba.replace(/\s+/g, '_')}_${timestamp}.xlsx`
  
  writeFile(wb, fileName)
  
  return fileName
}
