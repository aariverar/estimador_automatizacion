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
  Baja: { diseño: 2, desarrollo: 4, refactorizacion: 1, mantenimiento: 1, documentacion: 1 },
  Media: { diseño: 4, desarrollo: 8, refactorizacion: 2, mantenimiento: 2, documentacion: 2 },
  Alta: { diseño: 8, desarrollo: 16, refactorizacion: 4, mantenimiento: 4, documentacion: 3 }
}

function App() {
  const [formData, setFormData] = useState<EstimationForm>({
    nombreCasoPrueba: '',
    tipoComplejidad: '',
    tiempoDiseño: 0,
    tiempoDesarrollo: 0,
    tiempoRefactorizacion: 0,
    tiempoMantenimiento: 0,
    tiempoDocumentacion: 0,
    descripcionCaso: '',
    tecnologias: [],
    prioridad: ''
  })

  const [autoCalculate, setAutoCalculate] = useState(true)
  const [estimaciones, setEstimaciones] = useState<EstimationForm[]>([])

  // Calcular tiempo total
  const tiempoTotal = formData.tiempoDiseño + formData.tiempoDesarrollo + 
                     formData.tiempoRefactorizacion + formData.tiempoMantenimiento + 
                     formData.tiempoDocumentacion

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
    const complejidad = event.target.value as 'Baja' | 'Media' | 'Alta'
    
    setFormData(prev => {
      const newData = { ...prev, tipoComplejidad: complejidad }
      
      if (autoCalculate && complejidad && complejidadConfig[complejidad]) {
        const config = complejidadConfig[complejidad]
        newData.tiempoDiseño = config.diseño
        newData.tiempoDesarrollo = config.desarrollo
        newData.tiempoRefactorizacion = config.refactorizacion
        newData.tiempoMantenimiento = config.mantenimiento
        newData.tiempoDocumentacion = config.documentacion
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
      tiempoDiseño: 0,
      tiempoDesarrollo: 0,
      tiempoRefactorizacion: 0,
      tiempoMantenimiento: 0,
      tiempoDocumentacion: 0,
      descripcionCaso: '',
      tecnologias: [],
      prioridad: ''
    })
  }

  return (
    <ThemeProvider theme={santanderTheme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh', 
        backgroundColor: '#FAFAFA',
        width: '100%',
        overflow: 'auto'
      }}>
        {/* Header */}
        <AppBar position="static" elevation={0} sx={{ flexShrink: 0 }}>
          <Toolbar sx={{ minHeight: '64px' }}>
            <Engineering sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Estimador QA - Scripts Automatizados
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: '#EC0000', fontWeight: 'bold', fontSize: '16px' }}>QA</Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ 
          py: 4, 
          flex: 1,
          width: '100%',
          maxWidth: '100% !important',
          px: { xs: 2, sm: 3, md: 4 }
        }}>
          {/* Tarjeta de información */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(45deg, #EC0000 30%, #FF4444 90%)', color: 'white' }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
              🚀 Plataforma de Estimación QA
            </Typography>
            <Typography variant="body1">
              Calcula el esfuerzo necesario para desarrollar scripts automatizados de prueba de manera eficiente y precisa
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Formulario principal */}
            <Box sx={{ flex: 2 }}>
              <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#EC0000' }}>
                  <Calculate /> Datos del Caso de Prueba
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                        <MenuItem value="Baja">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, backgroundColor: '#4CAF50', borderRadius: '50%' }} />
                            Baja (2-9 horas)
                          </Box>
                        </MenuItem>
                        <MenuItem value="Media">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, backgroundColor: '#FF9800', borderRadius: '50%' }} />
                            Media (10-20 horas)
                          </Box>
                        </MenuItem>
                        <MenuItem value="Alta">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, backgroundColor: '#F44336', borderRadius: '50%' }} />
                            Alta (21+ horas)
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
                        onChange={(e) => setAutoCalculate(e.target.checked)}
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

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  {[
                    { key: 'tiempoDiseño', label: 'Tiempo Diseño', icon: <Description />, color: '#2196F3' },
                    { key: 'tiempoDesarrollo', label: 'Tiempo Desarrollo', icon: <Code />, color: '#4CAF50' },
                    { key: 'tiempoRefactorizacion', label: 'Tiempo Refactorización', icon: <Build />, color: '#FF9800' },
                    { key: 'tiempoMantenimiento', label: 'Tiempo Mantenimiento', icon: <Engineering />, color: '#9C27B0' },
                    { key: 'tiempoDocumentacion', label: 'Tiempo Documentación', icon: <Description />, color: '#607D8B' }
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
                            onChange={(_, value) => handleTimeChange(item.key as keyof EstimationForm, value as number)}
                            min={0}
                            max={40}
                            step={0.5}
                            marks={[
                              { value: 0, label: '0h' },
                              { value: 20, label: '20h' },
                              { value: 40, label: '40h' }
                            ]}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value}h`}
                            sx={{ color: item.color }}
                            disabled={autoCalculate && formData.tipoComplejidad !== ''}
                          />
                        </Box>
                        <TextField
                          fullWidth
                          type="number"
                          value={formData[item.key as keyof EstimationForm]}
                          onChange={(e) => handleTimeChange(item.key as keyof EstimationForm, parseFloat(e.target.value) || 0)}
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
                    { label: 'Diseño', value: formData.tiempoDiseño, color: '#2196F3' },
                    { label: 'Desarrollo', value: formData.tiempoDesarrollo, color: '#4CAF50' },
                    { label: 'Refactorización', value: formData.tiempoRefactorizacion, color: '#FF9800' },
                    { label: 'Mantenimiento', value: formData.tiempoMantenimiento, color: '#9C27B0' },
                    { label: 'Documentación', value: formData.tiempoDocumentacion, color: '#607D8B' }
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
                            acc + est.tiempoDiseño + est.tiempoDesarrollo + est.tiempoRefactorizacion + 
                            est.tiempoMantenimiento + est.tiempoDocumentacion, 0) / estimaciones.length).toFixed(1)}h
                        </Typography>
                        <Typography variant="body2">
                          Casos Alta complejidad: {estimaciones.filter(e => e.tipoComplejidad === 'Alta').length}
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
              © 2025 Santander - Plataforma de Estimación QA | Desarrollado para optimizar la planificación de scripts automatizados
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
