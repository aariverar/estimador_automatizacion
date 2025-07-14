import { useState, useCallback } from 'react'
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  FormControlLabel,
  Switch
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { 
  Calculate,
  Assessment,
  Code,
  Build,
  Description,
  Save,
  GetApp,
  ExpandMore,
  Schedule,
  Engineering
} from '@mui/icons-material'
import type { EstimationForm, ComplejidadConfig } from './types/estimation'
import { exportToExcel, exportCurrentEstimation } from './components/ExportUtils_new'
import './App.css'

// Tema personalizado de Santander
const santanderTheme = createTheme({
  palette: {
    primary: {
      main: '#EC0000',
      light: '#FF4444',
      dark: '#B30000',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FFFFFF',
      dark: '#F5F5F5',
      contrastText: '#EC0000'
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#333333',
      secondary: '#666666'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#EC0000'
    },
    h6: {
      fontWeight: 500,
      color: '#333333'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#EC0000',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(236, 0, 0, 0.1)'
        }
      }
    }
  }
})

// Configuración de tiempos base por complejidad (en horas)
const complejidadConfig: ComplejidadConfig = {
  'Muy Baja': { 
    analisisPreparacion: 1, 
    desarrollo: 2, 
    ejecucionDepuracion: 0.5, 
    mantenimientoRefactorizacion: 0.5, 
    integracionVerificacion: 0.5, 
    documentacionResguardo: 0.5 
  },
  Baja: { 
    analisisPreparacion: 2, 
    desarrollo: 4, 
    ejecucionDepuracion: 1, 
    mantenimientoRefactorizacion: 1, 
    integracionVerificacion: 1, 
    documentacionResguardo: 1 
  },
  Media: { 
    analisisPreparacion: 4, 
    desarrollo: 8, 
    ejecucionDepuracion: 3, 
    mantenimientoRefactorizacion: 2, 
    integracionVerificacion: 2, 
    documentacionResguardo: 2 
  },
  Alta: { 
    analisisPreparacion: 8, 
    desarrollo: 16, 
    ejecucionDepuracion: 6, 
    mantenimientoRefactorizacion: 4, 
    integracionVerificacion: 4, 
    documentacionResguardo: 3 
  },
  'Muy Alta': { 
    analisisPreparacion: 12, 
    desarrollo: 24, 
    ejecucionDepuracion: 10, 
    mantenimientoRefactorizacion: 6, 
    integracionVerificacion: 6, 
    documentacionResguardo: 4 
  }
}

function App() {
  const [formData, setFormData] = useState<EstimationForm>({
    nombreCasoPrueba: '',
    tipoComplejidad: '',
    tiempoAnalisisPreparacion: 0,
    tiempoDesarrollo: 0,
    tiempoEjecucionDepuracion: 0,
    tiempoMantenimientoRefactorizacion: 0,
    tiempoIntegracionVerificacion: 0,
    tiempoDocumentacionResguardo: 0,
    descripcionCaso: '',
    tecnologias: [],
    prioridad: ''
  })

  const [autoCalculate, setAutoCalculate] = useState(true)
  const [estimaciones, setEstimaciones] = useState<EstimationForm[]>([])

  // Calcular tiempo total
  const tiempoTotal = formData.tiempoAnalisisPreparacion + formData.tiempoDesarrollo + 
                     formData.tiempoEjecucionDepuracion + formData.tiempoMantenimientoRefactorizacion + 
                     formData.tiempoIntegracionVerificacion + formData.tiempoDocumentacionResguardo

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof EstimationForm) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Manejar cambio de complejidad con cálculo automático
  const handleComplejidadChange = (event: SelectChangeEvent<string>) => {
    const complejidad = event.target.value as 'Muy Baja' | 'Baja' | 'Media' | 'Alta' | 'Muy Alta'
    
    setFormData(prev => {
      const newData = { ...prev, tipoComplejidad: complejidad }
      
      if (autoCalculate && complejidad && complejidadConfig[complejidad]) {
        const config = complejidadConfig[complejidad]
        newData.tiempoAnalisisPreparacion = config.analisisPreparacion
        newData.tiempoDesarrollo = config.desarrollo
        newData.tiempoEjecucionDepuracion = config.ejecucionDepuracion
        newData.tiempoMantenimientoRefactorizacion = config.mantenimientoRefactorizacion
        newData.tiempoIntegracionVerificacion = config.integracionVerificacion
        newData.tiempoDocumentacionResguardo = config.documentacionResguardo
      }
      
      return newData
    })
  }

  // Manejar cambios en sliders de tiempo
  const handleTimeChange = (field: keyof EstimationForm, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Guardar estimación
  const handleSaveEstimation = useCallback(() => {
    if (!formData.nombreCasoPrueba || !formData.tipoComplejidad) {
      alert('Por favor, completa al menos el nombre del caso y la complejidad')
      return
    }

    setEstimaciones(prev => [...prev, { ...formData }])
    alert('Estimación guardada exitosamente')
  }, [formData])

  // Exportar a Excel
  const handleExportExcel = useCallback(() => {
    if (estimaciones.length === 0) {
      alert('No hay estimaciones para exportar. Guarda al menos una estimación primero.')
      return
    }

    try {
      const result = exportToExcel(estimaciones, 'Estimaciones_QA_Santander')
      if (result.success) {
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('Error al exportar:', error)
      alert('Error al exportar el archivo Excel')
    }
  }, [estimaciones])

  // Exportar estimación actual
  const handleExportCurrent = useCallback(() => {
    if (!formData.nombreCasoPrueba || !formData.tipoComplejidad) {
      alert('Por favor, completa al menos el nombre del caso y la complejidad antes de exportar')
      return
    }

    try {
      const fileName = exportCurrentEstimation(formData)
      alert(`Estimación actual exportada como: ${fileName}`)
    } catch (error) {
      console.error('Error al exportar estimación actual:', error)
      alert('Error al exportar la estimación actual')
    }
  }, [formData])

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      nombreCasoPrueba: '',
      tipoComplejidad: '',
      tiempoAnalisisPreparacion: 0,
      tiempoDesarrollo: 0,
      tiempoEjecucionDepuracion: 0,
      tiempoMantenimientoRefactorizacion: 0,
      tiempoIntegracionVerificacion: 0,
      tiempoDocumentacionResguardo: 0,
      descripcionCaso: '',
      tecnologias: [],
      prioridad: ''
    })
  }

  return (
    <ThemeProvider theme={santanderTheme}>
      {/* Header Fijo - Capa Superior */}
      <AppBar 
        position="fixed" 
        elevation={4} 
        sx={{ 
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300, // Capa más alta
          backgroundColor: '#EC0000',
          height: { xs: '56px', sm: '64px' }
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: '56px', sm: '64px' },
          padding: { xs: '0 16px', sm: '0 24px' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '16px', sm: '18px', md: '20px' },
              lineHeight: 1.2,
              color: 'white',
              textAlign: 'center'
            }}
          >
            Santander - Estimador de Automatización
          </Typography>
          <Box sx={{ 
            position: 'absolute', 
            right: { xs: 16, sm: 24 }, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <Box sx={{ 
              width: { xs: 32, sm: 40 }, 
              height: { xs: 32, sm: 40 }, 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Typography sx={{ 
                color: '#EC0000', 
                fontWeight: 'bold', 
                fontSize: { xs: '12px', sm: '16px' }
              }}>
                QA
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Espaciador para el header fijo */}
      <Box sx={{ height: { xs: '56px', sm: '64px' } }} />
      
      {/* Contenedor principal responsivo con scroll */}
      <Box sx={{ 
        width: '100%',
        minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
        maxHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
        backgroundColor: '#FAFAFA',
        position: 'relative',
        zIndex: 1,
        overflowY: 'auto', // Permite scroll vertical
        overflowX: 'hidden' // Evita scroll horizontal
      }}>
        <Container 
          maxWidth="lg" 
          className="main-content"
          sx={{ 
            py: { xs: 2, sm: 3 },
            width: '100%',
            maxWidth: '1200px',
            mx: 'auto',
            px: { xs: 1, sm: 2, md: 3, lg: 4 },
            minHeight: 'auto' // Permite que el contenido dicte la altura
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 2, sm: 3 } }}>
            {/* Formulario principal */}
            <Box sx={{ flex: 2 }}>
              <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#EC0000' }}>
                  <Calculate /> Datos del Caso de Prueba
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                  <TextField
                    fullWidth
                    label="Nombre del Caso de Prueba"
                    value={formData.nombreCasoPrueba}
                    onChange={handleInputChange('nombreCasoPrueba')}
                    placeholder="ej: TC001 - Validación Login Usuario"
                    required
                  />

                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                    <FormControl fullWidth required>
                      <InputLabel>Tipo de Complejidad</InputLabel>
                      <Select
                        value={formData.tipoComplejidad}
                        label="Tipo de Complejidad"
                        onChange={handleComplejidadChange}
                      >
                        <MenuItem value="Muy Baja">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, backgroundColor: '#8BC34A', borderRadius: '50%' }} />
                            Muy Baja (1-5 horas)
                          </Box>
                        </MenuItem>
                        <MenuItem value="Baja">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, backgroundColor: '#4CAF50', borderRadius: '50%' }} />
                            Baja (6-12 horas)
                          </Box>
                        </MenuItem>
                        <MenuItem value="Media">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, backgroundColor: '#FF9800', borderRadius: '50%' }} />
                            Media (13-25 horas)
                          </Box>
                        </MenuItem>
                        <MenuItem value="Alta">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, backgroundColor: '#F44336', borderRadius: '50%' }} />
                            Alta (26-45 horas)
                          </Box>
                        </MenuItem>
                        <MenuItem value="Muy Alta">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, backgroundColor: '#9C27B0', borderRadius: '50%' }} />
                            Muy Alta (46+ horas)
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Prioridad</InputLabel>
                      <Select
                        value={formData.prioridad}
                        label="Prioridad"
                        onChange={handleInputChange('prioridad')}
                      >
                        <MenuItem value="Baja">Baja</MenuItem>
                        <MenuItem value="Media">Media</MenuItem>
                        <MenuItem value="Alta">Alta</MenuItem>
                        <MenuItem value="Crítica">Crítica</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Descripción del Caso"
                    value={formData.descripcionCaso}
                    onChange={handleInputChange('descripcionCaso')}
                    placeholder="Describe brevemente qué validará este caso de prueba..."
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoCalculate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoCalculate(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Cálculo automático basado en complejidad"
                  />
                </Box>

                {/* Sección de tiempos */}
                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#EC0000' }}>
                  <Schedule /> Distribución de Tiempos
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: { xs: 2, sm: 3 } }}>
                  {[
                    { key: 'tiempoAnalisisPreparacion', label: 'Tiempo de Análisis y Preparación', icon: <Description />, color: '#2196F3' },
                    { key: 'tiempoDesarrollo', label: 'Tiempo de Desarrollo', icon: <Code />, color: '#4CAF50' },
                    { key: 'tiempoEjecucionDepuracion', label: 'Tiempo de Ejecución y Depuración', icon: <Build />, color: '#FF9800' },
                    { key: 'tiempoMantenimientoRefactorizacion', label: 'Tiempo de Mantenimiento y Refactorización', icon: <Engineering />, color: '#9C27B0' },
                    { key: 'tiempoIntegracionVerificacion', label: 'Tiempo de Integración y Verificación', icon: <Assessment />, color: '#795548' },
                    { key: 'tiempoDocumentacionResguardo', label: 'Tiempo de Documentación y Resguardo', icon: <Description />, color: '#607D8B' }
                  ].map((item) => (
                    <Card variant="outlined" key={item.key}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Box sx={{ color: item.color }}>{item.icon}</Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {item.label}
                          </Typography>
                        </Box>
                        <Box sx={{ px: 1 }}>
                          <Slider
                            value={formData[item.key as keyof EstimationForm] as number}
                            onChange={(_: Event, value: number | number[]) => handleTimeChange(item.key as keyof EstimationForm, value as number)}
                            min={0}
                            max={40}
                            step={0.5}
                            marks={[
                              { value: 0, label: '0h' },
                              { value: 20, label: '20h' },
                              { value: 40, label: '40h' }
                            ]}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value: number) => `${value}h`}
                            sx={{ color: item.color }}
                            disabled={autoCalculate && formData.tipoComplejidad !== ''}
                          />
                        </Box>
                        <TextField
                          fullWidth
                          type="number"
                          value={formData[item.key as keyof EstimationForm]}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTimeChange(item.key as keyof EstimationForm, parseFloat(e.target.value) || 0)}
                          inputProps={{ step: 0.5, min: 0 }}
                          size="small"
                          sx={{ mt: 1 }}
                          disabled={autoCalculate && formData.tipoComplejidad !== ''}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                {/* Botones de acción */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveEstimation}
                    size="large"
                  >
                    Guardar Estimación
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<GetApp />}
                    onClick={handleExportExcel}
                    size="large"
                  >
                    Exportar Historial
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<GetApp />}
                    onClick={handleExportCurrent}
                    size="large"
                    sx={{ borderColor: '#4CAF50', color: '#4CAF50' }}
                  >
                    Exportar Actual
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={resetForm}
                    size="large"
                    sx={{ borderColor: '#EC0000', color: '#EC0000' }}
                  >
                    Limpiar
                  </Button>
                </Box>
              </Paper>
            </Box>

            {/* Panel lateral de resultados */}
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#EC0000' }}>
                  <Assessment /> Resumen de Estimación
                </Typography>

                {/* Tiempo total destacado */}
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3, 
                  mb: 3, 
                  backgroundColor: '#EC0000', 
                  borderRadius: 2, 
                  color: 'white' 
                }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                    {tiempoTotal.toFixed(1)}h
                  </Typography>
                  <Typography variant="body1">
                    Tiempo Total Estimado
                  </Typography>
                </Box>

                {/* Desglose de tiempos */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Desglose por Actividad:
                  </Typography>
                  {[
                    { label: 'Análisis y Preparación', value: formData.tiempoAnalisisPreparacion, color: '#2196F3' },
                    { label: 'Desarrollo', value: formData.tiempoDesarrollo, color: '#4CAF50' },
                    { label: 'Ejecución y Depuración', value: formData.tiempoEjecucionDepuracion, color: '#FF9800' },
                    { label: 'Mantenimiento y Refactorización', value: formData.tiempoMantenimientoRefactorizacion, color: '#9C27B0' },
                    { label: 'Integración y Verificación', value: formData.tiempoIntegracionVerificacion, color: '#795548' },
                    { label: 'Documentación y Resguardo', value: formData.tiempoDocumentacionResguardo, color: '#607D8B' }
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: '50%' }} />
                        <Typography variant="body2">{item.label}</Typography>
                      </Box>
                      <Chip
                        label={`${item.value}h`}
                        size="small"
                        sx={{ backgroundColor: item.color, color: 'white' }}
                      />
                    </Box>
                  ))}
                </Box>

                {/* Información adicional */}
                {formData.tipoComplejidad && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Complejidad {formData.tipoComplejidad}</strong><br />
                      Estimación base ajustada automáticamente
                    </Typography>
                  </Alert>
                )}

                {/* Estadísticas */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle2">
                      📊 Estadísticas ({estimaciones.length} estimaciones)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {estimaciones.length > 0 ? (
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Promedio tiempo total: {(estimaciones.reduce((acc, est) => 
                            acc + est.tiempoAnalisisPreparacion + est.tiempoDesarrollo + est.tiempoEjecucionDepuracion + 
                            est.tiempoMantenimientoRefactorizacion + est.tiempoIntegracionVerificacion + est.tiempoDocumentacionResguardo, 0) / estimaciones.length).toFixed(1)}h
                        </Typography>
                        <Typography variant="body2">
                          Casos Alta/Muy Alta complejidad: {estimaciones.filter(e => e.tipoComplejidad === 'Alta' || e.tipoComplejidad === 'Muy Alta').length}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No hay estimaciones guardadas
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </Box>
          </Box>

          {/* Pie de página */}
          <Box sx={{ 
            mt: 4, 
            py: 3, 
            textAlign: 'center', 
            borderTop: '1px solid #E0E0E0' 
          }}>
            <Typography variant="body2" color="text.secondary">
              © Santander Consumer Bank - Aseguramiento de Calidad <br />
              Powered by Abraham Rivera | Support: arivera_scb@santander.com.pe - 2025
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
