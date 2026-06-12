'use client'
import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import Icon from './Icon'

interface ModalsProps {
  activeModal: string | null
  onClose: (id: string) => void
  onOpen: (id: string) => void
}

type FieldValid = Record<string, boolean | null | undefined>
type FieldMsg   = Record<string, string>

function validate(key: string, val: string, type: string, setValid: (k:string,v:boolean|null) => void, setMsg: (k:string,m:string) => void): boolean {
  val = (val || '').trim()
  let ok = false; let msg = ''; let err = ''
  if (type === 'email')    { ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val); err = 'Ingresa un correo válido'; msg = ok ? '✓ Correo válido' : '' }
  else if (type === 'name')    { ok = val.length >= 2; err = val ? 'Mínimo 2 caracteres' : 'Campo requerido'; msg = ok ? '✓ Correcto' : '' }
  else if (type === 'password') { ok = val.length >= 8; err = 'Mínimo 8 caracteres'; msg = ok ? '✓ Contraseña segura' : '' }
  else if (type === 'tel')  { ok = !val || /^[\d\s\+\-\(\)]{7,}$/.test(val); err = 'Formato inválido'; msg = '' }
  if (!val && type !== 'textarea') { setValid(key, null); setMsg(key, ''); return false }
  setValid(key, ok)
  setMsg(key, ok ? msg : err)
  return ok
}

function FieldHint({ valid, msg }: { valid: boolean | null | undefined, msg: string }) {
  if (!msg) return <div className="field-hint hint-info" style={{ minHeight:18 }} />
  const cls = valid === true ? 'hint-ok' : valid === false ? 'hint-error' : 'hint-info'
  return <div className={`field-hint ${cls}`}>{msg}</div>
}
function DemoModal({
  open,
  onClose,
  onOpen
}: {
  open: boolean
  onClose: () => void
  onOpen: (id: string) => void
}) {
  const { showToast } = useToast()

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    lastname: '',
    email: '',
    tel: '',
    password: '',
    confirmPassword: '',

    org: '',
    razonSocial: '',
    rfc: '',
    type: '',

    claveEmpresa: ''
  })

  const [fv, setFv] = useState<FieldValid>({})
  const [fm, setFm] = useState<FieldMsg>({})

  const sv = (k: string, v: boolean | null) =>
    setFv((p) => ({ ...p, [k]: v }))

  const sm = (k: string, m: string) =>
    setFm((p) => ({ ...p, [k]: m }))

  const vf = (k: string, val: string, type: string) =>
    validate(k, val, type, sv, sm)

  const nextStep = (from: number) => {
    if (from === 1) {
      const a = vf('dname', form.name, 'name')
      const b = vf('dlastname', form.lastname, 'name')
      const c = vf('demail', form.email, 'email')
      const d = vf('dpassword', form.password, 'password')

      if (!form.confirmPassword) {
        sv('dconfirmPassword', false)
        sm('dconfirmPassword', 'Confirma tu contraseña')
        showToast(
          'error',
          'Campos incompletos',
          'Por favor completa los campos requeridos.'
        )
        return
      }

      if (form.password !== form.confirmPassword) {
        sv('dconfirmPassword', false)
        sm('dconfirmPassword', 'Las contraseñas no coinciden')
        showToast(
          'error',
          'Contraseña inválida',
          'Las contraseñas no coinciden.'
        )
        return
      }

      sv('dconfirmPassword', true)
      sm('dconfirmPassword', '✓ Contraseñas coinciden')

      if (!a || !b || !c || !d) {
        showToast(
          'error',
          'Campos incompletos',
          'Por favor completa los campos requeridos.'
        )
        return
      }
    }

    if (from === 2) {
      const a = vf('dorg', form.org, 'name')
      const bt = !!form.type

      if (!bt) sv('dtype', false)

      if (!a || !bt) {
        showToast(
          'error',
          'Campos incompletos',
          'Por favor completa los campos requeridos.'
        )
        return
      }
    }

    setStep(from + 1)
  }

const submit = async () => {
  try {
    setSubmitting(true)

    /* 1. Crear empresa */
    const empresaRes = await fetch('http://localhost:3000/api/auth/empresa', 
      {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: form.org,
        razon_social: form.razonSocial,
        rfc: form.rfc,
        tipoDeInstitucion: form.type
      })
    })

    const empresaData = await empresaRes.json()

    if (!empresaRes.ok) {
      throw new Error(empresaData.message || 'Error al crear empresa')
    }

    const clave = empresaData.clave_segura

    /* 2. Crear admin */
    const adminRes = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        nombre: `${form.name} ${form.lastname}`,
        password: form.password,
        codigoEmpresa: clave
      })
    })

    const adminData = await adminRes.json()

    if (!adminRes.ok) {
      throw new Error(adminData.message || 'Error al crear administrador')
    }

    setForm(prev => ({
      ...prev,
      claveEmpresa: clave
    }))

    showToast('success', 'Cuenta creada', 'Empresa y administrador creados correctamente')

    setStep(3)

  } catch (error: unknown) {
    let message = 'Ocurrió un error inesperado'

    if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }

    showToast('error', 'Error', message)

  } finally {
    setSubmitting(false)
  }
}
  const stepClass = (n: number) => ({
    active: step === n,
    done: step > n
  })

  return (
 <div
      className={`modal-overlay${open ? ' open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-title">
          Crear Empresa + Administrador
        </div>

        <div className="modal-sub">
          Registra tu empresa y obtén acceso inmediato
        </div>

        {/* Steps */}
        <div className="form-steps">
          {[1, 2, 3].map((n) => {
            const cls = stepClass(n)
            const labels = ['Administrador', 'Empresa', 'Finalizar']

            return (
              <div
                key={n}
                className={`form-step${
                  cls.active ? ' active' : ''
                }${cls.done ? ' done' : ''}`}
              >
                <div className="step-circle">
                  {cls.done ? '✓' : n}
                </div>

                <div className="step-label-sm">
                  {labels[n - 1]}
                </div>
              </div>
            )
          })}
        </div>

        {/* PANEL 1 */}
        <div className={`form-panel${step === 1 ? ' active' : ''}`}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>

                <div className="input-wrap">
                <span className="input-icon"><Icon glyph={'👤'} /></span>
                <input
                  type="text"
                  className={
                    fv['dname'] === true
                      ? 'valid'
                      : fv['dname'] === false
                      ? 'invalid'
                      : ''
                  }
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={(e) => {
                    setForm((p) => ({
                      ...p,
                      name: e.target.value
                    }))
                    vf('dname', e.target.value, 'name')
                  }}
                />
              </div>

              <FieldHint
                valid={fv['dname']}
                msg={fm['dname'] || ''}
              />
            </div>

            <div className="form-group">
              <label>Apellido *</label>

                <div className="input-wrap">
                <span className="input-icon"><Icon glyph={'👤'} /></span>
                <input
                  type="text"
                  className={
                    fv['dlastname'] === true
                      ? 'valid'
                      : fv['dlastname'] === false
                      ? 'invalid'
                      : ''
                  }
                  placeholder="Tu apellido"
                  value={form.lastname}
                  onChange={(e) => {
                    setForm((p) => ({
                      ...p,
                      lastname: e.target.value
                    }))
                    vf('dlastname', e.target.value, 'name')
                  }}
                />
              </div>

              <FieldHint
                valid={fv['dlastname']}
                msg={fm['dlastname'] || ''}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Correo electrónico *</label>

              <div className="input-wrap">
              <span className="input-icon"><Icon glyph={'✉️'} /></span>
              <input
                type="email"
                className={
                  fv['demail'] === true
                    ? 'valid'
                    : fv['demail'] === false
                    ? 'invalid'
                    : ''
                }
                placeholder="correo@empresa.com"
                value={form.email}
                onChange={(e) => {
                  setForm((p) => ({
                    ...p,
                    email: e.target.value
                  }))
                  vf('demail', e.target.value, 'email')
                }}
              />
            </div>

            <FieldHint
              valid={fv['demail']}
              msg={fm['demail'] || ''}
            />
          </div>

          <div className="form-group">
            <label>Teléfono (opcional)</label>

            <div className="input-wrap">
              <span className="input-icon"><Icon glyph={'📱'} /></span>
              <input
                type="tel"
                placeholder="+52 55 1234 5678"
                value={form.tel}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    tel: e.target.value
                  }))
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña *</label>

            <div className="input-wrap">
              <span className="input-icon"><Icon glyph={'🔐'} /></span>
              <input
                type="password"
                className={
                  fv['dpassword'] === true
                    ? 'valid'
                    : fv['dpassword'] === false
                    ? 'invalid'
                    : ''
                }
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={(e) => {
                  setForm((p) => ({
                    ...p,
                    password: e.target.value
                  }))
                  vf('dpassword', e.target.value, 'password')
                }}
              />
            </div>

            <FieldHint
              valid={fv['dpassword']}
              msg={fm['dpassword'] || ''}
            />
          </div>

          <div className="form-group">
            <label>Confirmar contraseña *</label>

            <div className="input-wrap">
              <span className="input-icon"><Icon glyph={'🔐'} /></span>
              <input
                type="password"
                className={
                  fv['dconfirmPassword'] === true
                    ? 'valid'
                    : fv['dconfirmPassword'] === false
                    ? 'invalid'
                    : ''
                }
                placeholder="Repite tu contraseña"
                value={form.confirmPassword}
                onChange={(e) => {
                  setForm((p) => ({
                    ...p,
                    confirmPassword: e.target.value
                  }))
                }}
              />
            </div>

            <FieldHint
              valid={fv['dconfirmPassword']}
              msg={fm['dconfirmPassword'] || ''}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 8
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => nextStep(1)}
            >
              Continuar →
            </button>
          </div>
        </div>

    {/* PANEL 2 */}
<div className={`form-panel${step === 2 ? ' active' : ''}`}>
  <div className="form-group">
    <label>Nombre de la empresa / institución *</label>

    <div className="input-wrap">
      <span className="input-icon"><Icon glyph={'🏛️'} /></span>
      <input
        type="text"
        className={
          fv['dorg'] === true
            ? 'valid'
            : fv['dorg'] === false
            ? 'invalid'
            : ''
        }
        placeholder="Ej. Universidad Nacional Autónoma"
        value={form.org}
        onChange={(e) => {
          setForm((p) => ({
            ...p,
            org: e.target.value
          }))
          vf('dorg', e.target.value, 'name')
        }}
      />
    </div>

    <FieldHint
      valid={fv['dorg']}
      msg={fm['dorg'] || ''}
    />
  </div>

  <div className="form-row">
    <div className="form-group">
      <label>Razón Social (opcional)</label>

      <div className="input-wrap">
      <span className="input-icon"><Icon glyph={'🏢'} /></span>
        <input
          type="text"
          placeholder="Ej. VirtualID Solutions S.A. de C.V."
          value={form.razonSocial}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              razonSocial: e.target.value
            }))
          }
        />
      </div>
    </div>

    <div className="form-group">
      <label>RFC (opcional)</label>

      <div className="input-wrap">
        <span className="input-icon"><Icon glyph={'🧾'} /></span>
        <input
          type="text"
          placeholder="Ej. XAXX010101000"
          value={form.rfc}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              rfc: e.target.value
            }))
          }
        />
      </div>
    </div>
  </div>

  <div className="form-group">
    <label>Tipo de institución *</label>

    <select
      className={fv['dtype'] === false ? 'invalid' : ''}
      value={form.type}
      onChange={(e) => {
        setForm((p) => ({
          ...p,
          type: e.target.value
        }))
        sv('dtype', !!e.target.value)
      }}
    >
      <option value="">Seleccionar…</option>
      <option>Universidad / Preparatoria</option>
      <option>Hospital / Clínica</option>
      <option>Empresa privada</option>
      <option>Gobierno / Dependencia</option>
      <option>ONG / Asociación</option>
      <option>Otro</option>
    </select>
  </div>

  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 8
    }}
  >
    <button
      className="btn btn-ghost"
      onClick={() => setStep(1)}
    >
      ← Atrás
    </button>

    <button
      className="btn btn-primary"
      onClick={() => nextStep(2)}
    >
      Revisar →
    </button>
  </div>
</div>
{/* PANEL 3 */}
<div className={`form-panel${step === 3 ? ' active' : ''}`}>
  <div className="confirm-box">
    <div className="confirm-label">
      <Icon glyph={'✅'} /> Resumen de tu registro
    </div>

    <div className="confirm-data">
      <strong>Administrador:</strong> {form.name} {form.lastname}
      <br />

      <strong>Correo:</strong> {form.email}
      <br />

      <strong>Teléfono:</strong> {form.tel || 'No agregado'}
      <br />

      <strong>Empresa:</strong> {form.org}
      <br />

      <strong>Razón Social:</strong>{' '}
      {form.razonSocial || 'No agregada'}
      <br />

      <strong>RFC:</strong> {form.rfc || 'No agregado'}
      <br />

      <strong>Tipo:</strong> {form.type}
    </div>
  </div>

  <div
    className="security-row"
    style={{ marginBottom: 24 }}
  >
    <div className="sec-badge">
      <Icon glyph={'🔐'} /> Datos cifrados
    </div>

    <div className="sec-badge">
      <Icon glyph={'✅'} /> Registro seguro
    </div>
  </div>

  <button
    className={`btn btn-primary btn-full btn-lg${
      submitting ? ' loading' : ''
    }`}
    onClick={submit}
  >
    {submitting && <span className="spinner" />}

    <span className="btn-text">
      <Icon glyph={'🚀'} /> Crear empresa y administrador
    </span>
  </button>

  {form.claveEmpresa && (
    <div className="clave-box" style={{ marginTop: 24 }}>
      <label>Clave de Empresa</label>

      <div className="clave-copy">
        <input
          value={form.claveEmpresa}
          readOnly
        />

        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(
              form.claveEmpresa
            )

            showToast(
              'success',
              'Copiado',
              'Clave copiada al portapapeles'
            )
          }}
        >
          Copiar
        </button>
      </div>

      <div
        className="field-hint hint-info"
        style={{ marginTop: 8 }}
      >
        Guarda esta clave. Servirá para futuras
        configuraciones y accesos administrativos.
      </div>
    </div>
  )}

  <div style={{ marginTop: 16 }}>
    <button
      className="btn btn-ghost btn-sm"
      onClick={() => setStep(2)}
    >
      ← Volver a editar
    </button>
  </div>

  <div className="privacy-note">
    Al continuar aceptas nuestra{' '}
    <a href="#">Política de Privacidad</a>.
  </div>
</div>
 </div>
  </div>
  )
}

/* ── LOGIN MODAL ── */
function LoginModal({ open, onClose, onOpen }: { open:boolean; onClose:()=>void; onOpen:(id:string)=>void }) {
  const { showToast } = useToast()
  const [form, setForm] = useState({ email:'', password:'' })
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fv, setFv] = useState<FieldValid>({})
  const [fm, setFm] = useState<FieldMsg>({})

  const sv = (k:string,v:boolean|null) => setFv(p=>({...p,[k]:v}))
  const sm = (k:string,m:string) => setFm(p=>({...p,[k]:m}))
  const vf = (k:string,val:string,type:string) => validate(k,val,type,sv,sm)

const submit = async () => {
  const a = vf('lemail', form.email, 'email')
  const b = vf('lpass', form.password, 'password')

  if (!a || !b) {
    showToast('error','Datos inválidos','Por favor verifica tus credenciales.')
    return
  }

  try {
    setSubmitting(true)

    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Error al iniciar sesión')
    }

    const token = data.token

    // guardar token
    localStorage.setItem('token', token)

    showToast('success','¡Bienvenido!','Redirigiendo...')

    // 🔥 redirección a Angular
    window.location.href = `http://localhost:4200/panel-control?token=${token}`

  } catch (error: unknown) {
    let message = 'Error inesperado'
    if (error instanceof Error) message = error.message

    showToast('error','Error', message)
  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth:440 }}>
        <button className="modal-close" onClick={onClose}>×</button>
          <div style={{ textAlign:'center', marginBottom:28 }}>
          <div className="logo-icon" style={{ width:52,height:52,fontSize:24,margin:'0 auto 16px' }}><Icon glyph={'🪪'} /></div>
          <div className="modal-title" style={{ fontSize:24 }}>Bienvenido de vuelta</div>
          <div className="modal-sub" style={{ marginBottom:0 }}>Ingresa a tu panel de administración</div>
        </div>
          <div className="form-group">
          <label>Correo electrónico</label>
          <div className="input-wrap">
            <span className="input-icon"><Icon glyph={'✉️'} /></span>
            <input type="email" className={fv['lemail'] === true ? 'valid' : fv['lemail'] === false ? 'invalid' : ''} placeholder="admin@tuinstitucion.mx" value={form.email} onChange={e => { setForm(p=>({...p,email:e.target.value})); vf('lemail',e.target.value,'email') }} />
          </div>
          <FieldHint valid={fv['lemail']} msg={fm['lemail']||''} />
        </div>
          <div className="form-group">
          <label>Contraseña</label>
          <div className="input-wrap">
            <span className="input-icon"><Icon glyph={'🔑'} /></span>
            <input type={showPass ? 'text' : 'password'} className={fv['lpass'] === true ? 'valid' : fv['lpass'] === false ? 'invalid' : ''} placeholder="••••••••••••" value={form.password} onChange={e => { setForm(p=>({...p,password:e.target.value})); vf('lpass',e.target.value,'password') }} />
            <span className="input-right" onClick={() => setShowPass(p=>!p)}>{showPass ? '🙈' : '👁'}</span>
          </div>
          <FieldHint valid={fv['lpass']} msg={fm['lpass']||''} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', margin:'-8px 0 20px' }}>
          <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, color:'var(--gray-300)', margin:0, fontWeight:400 }}>
            <input type="checkbox" style={{ width:16, height:16, padding:0 }} /> Recordarme
          </label>
          <a href="#" style={{ fontSize:13, color:'var(--violet-light)', textDecoration:'none' }}>¿Olvidaste tu contraseña?</a>
        </div>
        <button className={`btn btn-primary btn-full btn-lg${submitting ? ' loading' : ''}`} onClick={submit}>
          {submitting && <span className="spinner" />}
          <span className="btn-text">Iniciar sesión</span>
        </button>
        <div className="form-divider">o</div>
        <button className="btn btn-outline btn-full" onClick={() => showToast('info','Acceso con SSO','Redirigiendo a tu proveedor de identidad…')}><Icon glyph={'🏢'} /> Acceso con SSO institucional</button>
        <div className="privacy-note" style={{ marginTop:20 }}>¿No tienes cuenta? <a href="#" onClick={e => { e.preventDefault(); onClose(); onOpen('demo') }}>Solicitar acceso</a></div>
      </div>
    </div>
  )
}

/* ── CONTACT MODAL ── */
function ContactModal({ open, onClose }: { open:boolean; onClose:()=>void }) {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name:'', org:'', email:'', msg:'' })
  const [submitting, setSubmitting] = useState(false)
  const [fv, setFv] = useState<FieldValid>({})
  const [fm, setFm] = useState<FieldMsg>({})

  const sv = (k:string,v:boolean|null) => setFv(p=>({...p,[k]:v}))
  const sm = (k:string,m:string) => setFm(p=>({...p,[k]:m}))
  const vf = (k:string,val:string,type:string) => validate(k,val,type,sv,sm)

  const submit = () => {
    const a = vf('cname', form.name, 'name')
    const b = vf('corg', form.org, 'name')
    const c = vf('cemail', form.email, 'email')
    if (!a || !b || !c) { showToast('error','Campos incompletos','Completa los campos requeridos.'); return }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onClose()
      showToast('success','¡Mensaje enviado!','Nuestro equipo te responderá en horario hábil.')
    }, 2500)
  }

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth:480 }}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-title">Hablar con un experto</div>
        <div className="modal-sub">Nuestro equipo de ventas te contactará en menos de 2 horas hábiles.</div>
        <div className="form-row">
          <div className="form-group">
            <label>Nombre *</label>
            <div className="input-wrap">
              <span className="input-icon"><Icon glyph={'👤'} /></span>
              <input type="text" className={fv['cname'] === true ? 'valid' : fv['cname'] === false ? 'invalid' : ''} placeholder="Tu nombre" value={form.name} onChange={e => { setForm(p=>({...p,name:e.target.value})); vf('cname',e.target.value,'name') }} />
            </div>
          </div>
          <div className="form-group">
            <label>Empresa *</label>
            <div className="input-wrap">
              <span className="input-icon"><Icon glyph={'🏢'} /></span>
              <input type="text" className={fv['corg'] === true ? 'valid' : fv['corg'] === false ? 'invalid' : ''} placeholder="Tu organización" value={form.org} onChange={e => { setForm(p=>({...p,org:e.target.value})); vf('corg',e.target.value,'name') }} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Correo *</label>
          <div className="input-wrap">
            <span className="input-icon"><Icon glyph={'✉️'} /></span>
            <input type="email" className={fv['cemail'] === true ? 'valid' : fv['cemail'] === false ? 'invalid' : ''} placeholder="correo@empresa.com" value={form.email} onChange={e => { setForm(p=>({...p,email:e.target.value})); vf('cemail',e.target.value,'email') }} />
          </div>
        </div>
        <div className="form-group">
          <label>Mensaje</label>
          <textarea placeholder="Cuéntanos sobre tu necesidad o proyecto…" value={form.msg} onChange={e => setForm(p=>({...p,msg:e.target.value}))} style={{ paddingLeft:14 }} />
        </div>
          <button className={`btn btn-primary btn-full btn-lg${submitting ? ' loading' : ''}`} onClick={submit}>
          {submitting && <span className="spinner" />}
          <span className="btn-text"><Icon glyph={'💬'} /> Enviar mensaje</span>
        </button>
        <div className="privacy-note">Respuesta garantizada en horario hábil (L–V 9am–6pm CST).</div>
      </div>
    </div>
  )
}

/* ── MAIN EXPORT ── */
export default function Modals({ activeModal, onClose, onOpen }: ModalsProps) {
  return (
    <>
      <DemoModal    open={activeModal === 'demo'}    onClose={() => onClose('demo')}    onOpen={onOpen} />
      <LoginModal   open={activeModal === 'login'}   onClose={() => onClose('login')}   onOpen={onOpen} />
      <ContactModal open={activeModal === 'contact'} onClose={() => onClose('contact')} />
    </>
  )
}