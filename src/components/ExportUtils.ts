import { utils, writeFile } from 'xlsx'
import { EstimationForm } from '../types/estimation'

export const exportToExcel = (estimaciones: EstimationForm[], nombreArchivo: string = 'estimaciones_qa') => {
  try {
    // Preparar datos para Excel
    const datosExcel = estimaciones.map((estimacion, index) => {
      const tiempoTotal = estimacion.tiempoDiseño + estimacion.tiempoDesarrollo + 
                         estimacion.tiempoRefactorizacion + estimacion.tiempoMantenimiento + 
                         estimacion.tiempoDocumentacion

      return {
        'N°': index + 1,
        'Nombre del Caso': estimacion.nombreCasoPrueba,
        'Complejidad': estimacion.tipoComplejidad,
        'Prioridad': estimacion.prioridad,
        'Tiempo Diseño (h)': estimacion.tiempoDiseño,
        'Tiempo Desarrollo (h)': estimacion.tiempoDesarrollo,
        'Tiempo Refactorización (h)': estimacion.tiempoRefactorizacion,
        'Tiempo Mantenimiento (h)': estimacion.tiempoMantenimiento,
        'Tiempo Documentación (h)': estimacion.tiempoDocumentacion,
        'Tiempo Total (h)': tiempoTotal,
        'Descripción': estimacion.descripcionCaso
      }
    })

    // Crear resumen estadístico
    const totalCasos = estimaciones.length
    const tiempoTotalProyecto = estimaciones.reduce((acc, est) => 
      acc + est.tiempoDiseño + est.tiempoDesarrollo + est.tiempoRefactorizacion + 
      est.tiempoMantenimiento + est.tiempoDocumentacion, 0)
    
    const promedioTiempo = totalCasos > 0 ? tiempoTotalProyecto / totalCasos : 0
    
    const casosAltaComplejidad = estimaciones.filter(e => e.tipoComplejidad === 'Alta').length
    const casosMediaComplejidad = estimaciones.filter(e => e.tipoComplejidad === 'Media').length
    const casosBajaComplejidad = estimaciones.filter(e => e.tipoComplejidad === 'Baja').length

    const resumen = [
      { 'Métrica': 'Total de Casos', 'Valor': totalCasos },
      { 'Métrica': 'Tiempo Total del Proyecto (h)', 'Valor': tiempoTotalProyecto.toFixed(1) },
      { 'Métrica': 'Tiempo Promedio por Caso (h)', 'Valor': promedioTiempo.toFixed(1) },
      { 'Métrica': 'Casos Alta Complejidad', 'Valor': casosAltaComplejidad },
      { 'Métrica': 'Casos Media Complejidad', 'Valor': casosMediaComplejidad },
      { 'Métrica': 'Casos Baja Complejidad', 'Valor': casosBajaComplejidad }
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
  const tiempoTotal = estimacion.tiempoDiseño + estimacion.tiempoDesarrollo + 
                     estimacion.tiempoRefactorizacion + estimacion.tiempoMantenimiento + 
                     estimacion.tiempoDocumentacion

  const datosExcel = [{
    'Nombre del Caso': estimacion.nombreCasoPrueba,
    'Complejidad': estimacion.tipoComplejidad,
    'Prioridad': estimacion.prioridad,
    'Tiempo Diseño (h)': estimacion.tiempoDiseño,
    'Tiempo Desarrollo (h)': estimacion.tiempoDesarrollo,
    'Tiempo Refactorización (h)': estimacion.tiempoRefactorizacion,
    'Tiempo Mantenimiento (h)': estimacion.tiempoMantenimiento,
    'Tiempo Documentación (h)': estimacion.tiempoDocumentacion,
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
  try {
    // Preparar datos para Excel
    const datosExcel = estimaciones.map((estimacion, index) => {
      const tiempoTotal = estimacion.tiempoDiseño + estimacion.tiempoDesarrollo + 
                         estimacion.tiempoRefactorizacion + estimacion.tiempoMantenimiento + 
                         estimacion.tiempoDocumentacion

      return {
        'N°': index + 1,
        'Nombre del Caso': estimacion.nombreCasoPrueba,
        'Complejidad': estimacion.tipoComplejidad,
        'Prioridad': estimacion.prioridad,
        'Tiempo Diseño (h)': estimacion.tiempoDiseño,
        'Tiempo Desarrollo (h)': estimacion.tiempoDesarrollo,
        'Tiempo Refactorización (h)': estimacion.tiempoRefactorizacion,
        'Tiempo Mantenimiento (h)': estimacion.tiempoMantenimiento,
        'Tiempo Documentación (h)': estimacion.tiempoDocumentacion,
        'Tiempo Total (h)': tiempoTotal,
        'Descripción': estimacion.descripcionCaso
      }
    })

    // Crear resumen estadístico
    const totalCasos = estimaciones.length
    const tiempoTotalProyecto = estimaciones.reduce((acc, est) => 
      acc + est.tiempoDiseño + est.tiempoDesarrollo + est.tiempoRefactorizacion + 
      est.tiempoMantenimiento + est.tiempoDocumentacion, 0)
    
    const promedioTiempo = totalCasos > 0 ? tiempoTotalProyecto / totalCasos : 0
    
    const casosAltaComplejidad = estimaciones.filter(e => e.tipoComplejidad === 'Alta').length
    const casosMediaComplejidad = estimaciones.filter(e => e.tipoComplejidad === 'Media').length
    const casosBajaComplejidad = estimaciones.filter(e => e.tipoComplejidad === 'Baja').length

    const resumen = [
      { 'Métrica': 'Total de Casos', 'Valor': totalCasos },
      { 'Métrica': 'Tiempo Total del Proyecto (h)', 'Valor': tiempoTotalProyecto.toFixed(1) },
      { 'Métrica': 'Tiempo Promedio por Caso (h)', 'Valor': promedioTiempo.toFixed(1) },
      { 'Métrica': 'Casos Alta Complejidad', 'Valor': casosAltaComplejidad },
      { 'Métrica': 'Casos Media Complejidad', 'Valor': casosMediaComplejidad },
      { 'Métrica': 'Casos Baja Complejidad', 'Valor': casosBajaComplejidad }
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
  const tiempoTotal = estimacion.tiempoDiseño + estimacion.tiempoDesarrollo + 
                     estimacion.tiempoRefactorizacion + estimacion.tiempoMantenimiento + 
                     estimacion.tiempoDocumentacion

  const datosExcel = [{
    'Nombre del Caso': estimacion.nombreCasoPrueba,
    'Complejidad': estimacion.tipoComplejidad,
    'Prioridad': estimacion.prioridad,
    'Tiempo Diseño (h)': estimacion.tiempoDiseño,
    'Tiempo Desarrollo (h)': estimacion.tiempoDesarrollo,
    'Tiempo Refactorización (h)': estimacion.tiempoRefactorizacion,
    'Tiempo Mantenimiento (h)': estimacion.tiempoMantenimiento,
    'Tiempo Documentación (h)': estimacion.tiempoDocumentacion,
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
