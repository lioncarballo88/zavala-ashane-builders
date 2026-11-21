# Manual maestro — Zavala Ashane Builders (sitio web)

**Última actualización:** 21 de noviembre de 2026
**Alcance:** dónde vive cada cosa, con qué cuentas, cómo se publica y cómo se opera.
Este documento es interno: **no se publica** en el sitio ni se incluye en los ZIP de
despliegue (`.htaccess` y `_redirects` lo bloquean con 404 si alguien intenta abrirlo).

> Documentos hermanos: [README.md](./README.md) (visión técnica del código),
> [DEPLOY.md](./DEPLOY.md) (guía de despliegue detallada) y
> [PENDIENTES.md](./PENDIENTES.md) (contenido pendiente del cliente).

---

## 1. Resumen en 30 segundos

| Pregunta | Respuesta |
| --- | --- |
| ¿Qué es? | Sitio corporativo estático de **Zavala Ashane Builders LLC** (construcción residencial y comercial, The Woodlands, TX). 5 páginas HTML. |
| ¿Dónde está el código? | GitHub: `lioncarballo88/zavala-ashane-builders` (público). Copia local en `C:\Users\Lionc\Documents\zavala-ashane-builders`. |
| ¿Dónde se publica? | **GitHub Pages**, desde la rama `gh-pages`. |
| ¿En qué dominio? | **https://zavalaashanebuilders.com** (apex; `www` redirige con 301). |
| ¿Quién administra el dominio y el DNS? | **GoDaddy** (registrador + DNS + forwarding de `www`). |
| ¿Hay base de datos? | **No.** Cero backend. Único almacenamiento: `localStorage` del navegador para el idioma. |
| ¿Hay build / bundler? | **No.** HTML, CSS y JS se sirven tal cual. No hay `package.json` ni `node_modules`. |
| ¿Cómo se actualiza? | `powershell -ExecutionPolicy Bypass -File .\publish-gh-pages.ps1 -CustomDomain` |
| ¿Hay correo en el dominio? | **Sí**, Microsoft 365 (`info@zavalaashanebuilders.com`). No tocar MX/TXT. |

---

## 2. Mapa de la infraestructura

| Componente | Proveedor | Identificador / ubicación | Cuenta |
| --- | --- | --- | --- |
| Código fuente (repo) | **GitHub** | `lioncarballo88/zavala-ashane-builders` (público) | `lioncarballo88` |
| Rama de trabajo | GitHub | `main` | `lioncarballo88` |
| Rama publicada | GitHub | `gh-pages` (solo archivos del sitio) | `lioncarballo88` |
| Copia local | PC de Cesar | `C:\Users\Lionc\Documents\zavala-ashane-builders` | usuario Windows `Lionc` |
| Hosting del sitio | **GitHub Pages** | `https://zavalaashanebuilders.com` + `https://lioncarballo88.github.io/zavala-ashane-builders/` | `lioncarballo88` |
| Dominio (registro) | **GoDaddy** | `zavalaashanebuilders.com` | CESAR ZAVALA |
| DNS | **GoDaddy** (ns11/ns12.domaincontrol.com) | panel GoConnect → Manage DNS records | CESAR ZAVALA |
| Redirección `www` | **GoDaddy Forwarding** | 301 → `https://zavalaashanebuilders.com` | CESAR ZAVALA |
| Correo | **Microsoft 365** | tenant `NETORGFT20339501.onmicrosoft.com`, buzón `info@zavalaashanebuilders.com` | admin de M365 |
| Certificado HTTPS (apex) | **Let's Encrypt** vía GitHub Pages | `CN=zavalaashanebuilders.com`, expira 19-feb-2027 | automático |
| Certificado HTTPS (`www`) | **GoDaddy** (servicio de forwarding) | `CN=zavalaashanebuilders.com` | automático |
| Preview alterno (legado) | **Netlify** | `preeminent-moonbeam-ba3b7f.netlify.app` | `lioncarballo@gmail.com` |
| Sitios legado (sin uso) | **GoDaddy Website Builder** | `zavalaashanebuilders.godaddysites.com`, `site-nrd194c86.godaddysites.com` | CESAR ZAVALA |
| Base de datos | — | **No existe** | — |

**Flujo real hoy:**

```
PC local  →  git push origin main  →  GitHub (repo)
                                      │
                    publish-gh-pages.ps1 (copia solo el sitio)
                                      ▼
                                 rama gh-pages  →  GitHub Pages  →  zavalaashanebuilders.com
                                                                         ▲
                                            GoDaddy DNS (4 × A) ─────────┘
```

---

## 3. Cuentas y accesos

> **No hay contraseñas en este repositorio** (ni tokens, ni claves). Todo se guarda en
> el gestor de contraseñas del negocio o en el llavero de Windows.

| Servicio | Usuario / email | Detalles |
| --- | --- | --- |
| **GitHub** | `lioncarballo88` · `lioncarballo@gmail.com` | Repo del sitio + Pages. 2FA: activar y guardar códigos de recuperación. |
| **GitHub CLI (esta PC)** | `lioncarballo88` | Token OAuth guardado en el llavero de Windows (`gh auth status`). Scopes: `gist`, `read:org`, `repo`, `workflow`. |
| **Git (identidad de commits)** | `Cesar Zavala <lioncarballo@gmail.com>` | Configurado a nivel local del repo. |
| **Netlify** | `lioncarballo@gmail.com` | Team **`lioncarballo88's team`** (slug `lioncarballo88-uqwhk7a`). Proyectos: `preeminent-moonbeam-ba3b7f` (preview) y `bpmkt`. |
| **GoDaddy** | cuenta a nombre de **CESAR ZAVALA** (usuario exacto no documentado) | Dominio + DNS + forwarding + 2 sitios de Website Builder. Entrar en `account.godaddy.com`. |
| **Microsoft 365** | buzón `info@zavalaashanebuilders.com` | Tenant `NETORGFT20339501.onmicrosoft.com`. Administración en `admin.microsoft.com`. |
| **Let's Encrypt** | — | Sin cuenta: GitHub Pages pide y renueva el certificado solo. |

**Cuentas que NO se usan** (importante para no perder tiempo buscándolas):
Vercel, Cloudflare, Supabase, Firebase, Formspree, Google Search Console (aún no
registrado).

**Cuenta de Netlify inaccesible:** el dominio quedó reclamado por un team de Netlify al
que ya no se tiene acceso (fue el que creó el sitio viejo `preeminent-naiad-7c9ab4`).
Ese team no aparece en `lioncarballo@gmail.com`. No afecta al sitio actual: Netlify ya no
participa en el DNS.

---

## 4. Dominio

| Dato | Valor |
| --- | --- |
| Dominio | `zavalaashanebuilders.com` |
| Registrador | **GoDaddy.com, LLC** (IANA ID 146) |
| Fecha de registro | **9-feb-2026** |
| Expira | **9-feb-2029** |
| Nameservers | `ns11.domaincontrol.com`, `ns12.domaincontrol.com` (GoDaddy) |
| Estado EPP | `client delete/renew/transfer/update prohibited` (bloqueo normal de GoDaddy) |
| DNSSEC | No firmado |
| Registrante WHOIS | Privado (*Domains By Proxy*, LLC) |
| Correo en el dominio | Microsoft 365 (MX → `…mail.protection.outlook.com`) |

**Recomendación:** activar **renovación automática** en GoDaddy y verificar que la tarjeta
asociada siga vigente. Si el dominio caduca, el sitio deja de resolver aunque GitHub Pages
siga publicado.

---

## 5. DNS (estado real, 21-nov-2026)

Panel: **GoDaddy → GoConnect → Manage DNS records**
`https://dcc.godaddy.com/control/dnsmanagement?domainName=zavalaashanebuilders.com`

### 5.1 Registros del sitio (los que gestionamos)

| Tipo | Nombre | Valor | Función |
| --- | --- | --- | --- |
| `A` | `@` | `185.199.108.153` | GitHub Pages |
| `A` | `@` | `185.199.109.153` | GitHub Pages |
| `A` | `@` | `185.199.110.153` | GitHub Pages |
| `A` | `@` | `185.199.111.153` | GitHub Pages |
| — | `www` | **Forwarding 301** → `https://zavalaashanebuilders.com` | Redirección (GoDaddy crea `A 15.197.225.128` y `A 3.33.251.168`) |

### 5.2 Registros de correo y servicios (NO TOCAR)

| Tipo | Nombre | Valor | Función |
| --- | --- | --- | --- |
| `MX` | `@` | `zavalaashanebuilders-com.mail.protection.outlook.com` (prio 0) | Correo Microsoft 365 |
| `TXT` | `@` | `NETORGFT20339501.onmicrosoft.com` | Verificación del tenant M365 |
| `TXT` | `@` | `v=spf1 include:secureserver.net -all` | SPF anti-suplantación |
| `TXT` | `_dmarc` | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net` | DMARC |
| `CNAME` | `autodiscover` | `autodiscover.outlook.com` | Autoconfiguración de Outlook |
| `CNAME` | `email` | `email.secureserver.net` | Webmail/GoDaddy email |
| `CNAME` | `lyncdiscover` | `webdir.online.lync.com` | Skype/Teams legacy |
| `CNAME` | `msoid` | `clientconfig.microsoftonline-p.net` | Autenticación M365 |
| `CNAME` | `sip` | `sipdir.online.lync.com` | Teams/Skype |
| `CNAME` | `_domainconnect` | `_domainconnect.gd.domaincontrol.com` | Servicio de GoDaddy |
| `CNAME` | `pay` | `paylinks.commerce.godaddy.com` | Pagos GoDaddy |
| `SRV` | `_sip._tls` | `100 1 443 sipdir.online.lync.com` | Teams/Skype |
| `SRV` | `_sipfederationtls._tcp` | `100 1 5061 sipfed.online.lync.com` | Federación Teams |
| `SOA` | `@` | `ns11.domaincontrol.com` | Autoridad de la zona |
| `NS` | `@` | `ns11.domaincontrol.com`, `ns12.domaincontrol.com` | Nameservers |

### 5.3 Notas operativas del panel de GoDaddy

- El panel nuevo se llama **GoConnect**; la tabla está en **Manage DNS records**.
- **Editar un `A @` en su lugar puede fallar** con *"el valor no es válido"*. Lo que
  funciona: **borrar el registro y crearlo de nuevo** con *Add New Record*.
- El campo se llama **Value** en el formulario y **Data** en la cabecera de la tabla.
- Si GoDaddy insiste en un error al añadir, suele ser un duplicado (mismo tipo + nombre +
  valor ya existente).
- No cambiar los **nameservers** a Netlify/Cloudflare: hay que recrear todo el correo.

---

## 6. Hosting y despliegue

### 6.1 Por qué GitHub Pages

Netlify rechaza el dominio con *"zavalaashanebuilders.com … is already managed by Netlify
DNS on another team"*. Sin acceso a ese team, Netlify queda descartado. GitHub Pages es
gratuito, permite uso comercial y funciona con el DNS de GoDaddy sin mover nameservers
(por eso el correo sigue intacto).

### 6.2 Configuración de GitHub Pages

| Ajuste | Valor |
| --- | --- |
| Source | **Deploy from a branch** |
| Branch | **`gh-pages`** |
| Folder | **`/ (root)`** |
| Custom domain | `zavalaashanebuilders.com` |
| Enforce HTTPS | Activado |
| Archivo `CNAME` | dentro de `gh-pages` |
| `.nojekyll` | dentro de `gh-pages` (evita el procesado Jekyll) |
| 404 | `404.html` generado desde `index.html` en cada publicación |

### 6.3 Qué se publica y qué no

La rama `gh-pages` contiene **solo 43 archivos**: las 5 páginas HTML, `404.html`,
`robots.txt`, `sitemap.xml`, `CNAME`, `.nojekyll` y `assets/`.

**Nunca se publican:** `_source/` (originales del cliente), `.git`, `README.md`,
`DEPLOY.md`, `PENDIENTES.md`, `MANUAL.md`, los scripts `.ps1`, `netlify.toml`,
`.htaccess`, `_redirects`, `CNAME` de nivel raíz del repo (se copia al bundle) y
`zavala-ashane-deploy.zip`.

### 6.4 Publicar un cambio

```powershell
# 1. editar archivos en la copia local
# 2. revisar
git status
git add -A
git commit -m "Contenido: descripción del cambio"
git push origin main

# 3. publicar al sitio
powershell -ExecutionPolicy Bypass -File .\publish-gh-pages.ps1 -CustomDomain
```

`-CustomDomain` incluye el archivo `CNAME`. **Úsalo siempre a partir de ahora** (el dominio
ya está activo); sin ese flag, un despliegue quitaría el dominio del sitio publicado.

### 6.5 Verificar que quedó bien

```powershell
curl.exe -sS -o NUL -w "%{http_code}`n" https://zavalaashanebuilders.com
curl.exe -sS -o NUL -w "%{http_code} -> %{redirect_url}`n" http://zavalaashanebuilders.com
curl.exe -sS -o NUL -w "%{http_code}`n" https://www.zavalaashanebuilders.com
```

Esperado: `200`, `301 → https://zavalaashanebuilders.com/`, `301` (y siguiendo la cadena
termina en `200`).

También se puede ver el estado de Pages:

```powershell
gh api repos/lioncarballo88/zavala-ashane-builders/pages --jq '{cname:.cname,status:.status,https:.https_enforced}'
```

### 6.6 Revertir un cambio publicado

`gh-pages` es un historial propio, así que hay dos formas:

```powershell
# Opción A (recomendada): revertir en main y republicar
git revert <commit>
git push origin main
powershell -ExecutionPolicy Bypass -File .\publish-gh-pages.ps1 -CustomDomain

# Opción B: volver a publicar el estado de un commit anterior
git checkout <commit> -- index.html
powershell -ExecutionPolicy Bypass -File .\publish-gh-pages.ps1 -CustomDomain
git checkout main -- index.html
```

### 6.7 Requisito importante: GitHub Actions está bloqueado

El workflow de Actions **no se puede usar**: GitHub responde *"The job was not started
because your account is locked due to a billing issue."* Por eso el despliegue es por
rama. Si se resuelve el tema de facturación en GitHub, se podría volver a Actions, pero
**no es necesario**: el flujo por rama funciona igual y no consume minutos.

---

## 7. Código: lenguajes, estructura y dependencias

### 7.1 Lenguajes y tecnologías

| Capa | Tecnología | Notas |
| --- | --- | --- |
| Marcado | **HTML5** | 5 páginas; `lang="en"` con traducción dinámica a español |
| Datos estructurados | **JSON-LD schema.org** | Bloques `GeneralContractor` / `Residence` en 4 páginas |
| Estilos | **CSS3** | Custom properties, Grid/Flexbox, `clamp()`, animaciones; 6 archivos |
| Comportamiento | **JavaScript (vanilla)** | Sin frameworks; IIFE + APIs modernas (`IntersectionObserver`, `matchMedia`, `Map`, `fetch`) |
| SEO | **XML** (`sitemap.xml`), **TXT** (`robots.txt`) | URLs absolutas al dominio real |
| Config de hosting | **Apache** (`.htaccess`), **Netlify** (`_redirects`, `netlify.toml` en TOML) | Hoy `.htaccess` y `_redirects` **no** se aplican en GitHub Pages |
| Automatización | **PowerShell 5.1** | `publish-gh-pages.ps1`, `build-deploy-zip.ps1` |

**No hay:** base de datos, backend, API, CMS, framework JS, preprocesador CSS,
bundler, `package.json`, `node_modules`, Docker, ni tests automatizados.

### 7.2 Dependencias externas del sitio

**Ninguna en tiempo de ejecución.** Todo es local:

- Fuentes **Barlow / Barlow Condensed** self-hosted (`assets/fonts/*.woff2`, 7 archivos).
- Todas las imágenes en `assets/images/` (18 archivos). No hay hotlinking.
- El único enlace externo es el **LinkedIn** del fundador
  (`https://www.linkedin.com/in/cesar-zavala-medellin-796748179/`).

### 7.3 JavaScript

| Archivo | Tamaño | Qué hace |
| --- | --- | --- |
| `assets/js/i18n-data.js` | 35,6 KB | Diccionario **inglés → español**. Las claves son el texto exacto en inglés del HTML. |
| `assets/js/i18n.js` | 7,1 KB | Motor de traducción: recorre `TEXT`, `ATTRS` y `BLOCKS`, aplica el idioma y recuerda la elección en `localStorage` bajo la clave **`zab-lang`**. El botón EN/ES está en el header. |
| `assets/js/main.js` | 10,5 KB | Header con scroll, menú móvil accesible, scroll-spy con `IntersectionObserver`, animaciones `.reveal`, botón *back to top* y validación del formulario de contacto (con `fetch` opcional a `data-form-endpoint`). |

⚠️ **Al editar textos en inglés hay que actualizar la clave en `i18n-data.js`**, si no esa
línea se queda en inglés al cambiar a español. En consola: `ZABuntranslated()` lista las
claves que faltan.

### 7.4 CSS

Orden de carga (importa): `base.css` → `components.css` → `sections.css` →
`property.css` / `pages.css` → `fonts.css`.

| Archivo | Uso |
| --- | --- |
| `base.css` | Tokens de diseño, reset, tipografía, utilidades |
| `components.css` | Botones, header/nav, tarjetas, formularios, footer |
| `sections.css` | Layouts por sección (hero, servicios, proyectos, CTA…) |
| `property.css` | Solo las 2 páginas de propiedad |
| `pages.css` | Solo `about.html` y `our-impact.html` |
| `fonts.css` | `@font-face` de las fuentes locales |

⚠️ Cada `<link>`/`<script>` lleva **`?v=N`** en el HTML. Al cambiar un CSS o JS hay que
**subir ese número** en los 5 HTML; si no, los navegadores siguen mostrando la copia vieja
(hasta 1 mes con el cache anterior).

---

## 8. Base de datos

**No existe base de datos.** El sitio es 100 % estático: no hay servidor, no hay API, no
hay formularios que guarden nada.

Lo único que se almacena en el navegador del visitante:

| Clave | Ubicación | Contenido | Duración |
| --- | --- | --- | --- |
| `zab-lang` | `localStorage` | `"en"` o `"es"` — idioma elegido | Permanente hasta borrar datos del navegador |

Si en el futuro se necesita persistencia (por ejemplo, guardar los envíos del formulario),
las opciones compatibles con un sitio estático son: **Netlify Forms**, **Formspree**,
**Basin**, una **Google Sheet vía Apps Script** o **Supabase**. Cualquiera implica crear
cuenta, configurar un endpoint y dejar de ser 100 % estático (seguiría sin servidor
propio, pero con un servicio externo y probablemente un plan de pago).

---

## 9. Formulario de contacto

Estado actual: **oculto y sin servicio**.

```html
<form id="contact-form" action="#" method="post" novalidate hidden
      data-form-endpoint=""
      data-mailto="mailto:info@zavalaashanebuilders.com?subject=Website%20Inquiry">
```

- `hidden` → no se muestra.
- `data-form-endpoint=""` → vacío, así que no envía a ningún lado.
- `data-mailto` → respaldo: abre el cliente de correo con destino `info@…`.

**Para activarlo:**

1. Elegir servicio (Formspree, Netlify Forms, Basin…).
2. Pegar la URL en `data-form-endpoint`.
3. Quitar el atributo `hidden`.
4. Restaurar `.contact__grid` a dos columnas en `assets/css/sections.css`.
5. Subir el `?v=` de `sections.css` y republicar.

---

## 10. Herramientas instaladas en la PC

| Herramienta | Versión | Para qué se usa |
| --- | --- | --- |
| Windows | 11 Pro Education | Sistema |
| **PowerShell** | 5.1.26100.9818 | Ejecutar los scripts de publicación |
| **Git** | 2.56.0.windows.4 | Control de versiones |
| **GitHub CLI (`gh`)** | 2.105.0 | Crear repo, configurar Pages, comprobar estado |
| **VS Code** | 1.146.0 (x64) | Editor (`C:\Users\Lionc\AppData\Local\Programs\Microsoft VS Code`) |
| **winget** | v1.29.380 | Instalación de `gh` |
| Node.js | v26.4.0 | **No** es requisito del sitio (disponible, sin uso) |
| npm | 11.17.0 | **No** es requisito del sitio (disponible, sin uso) |
| Python | 3.14.6 | **No** es requisito del sitio (se usó solo para validar YAML) |

**Mínimo indispensable para publicar en otra PC:** Git + PowerShell (+ `gh` si se quiere
tocar la configuración de Pages). Instalación de `gh`:

```powershell
winget install --id GitHub.cli --silent --accept-source-agreements --accept-package-agreements
gh auth login --hostname github.com --git-protocol https --web --scopes repo,workflow
gh auth setup-git
```

---

## 11. Extensiones de VS Code (de la PC, no del proyecto)

El proyecto **no requiere ninguna extensión**. Estas son las instaladas en el equipo
(estado 21-nov-2026):

| Extensión | Versión | Relación con este proyecto |
| --- | --- | --- |
| `github.vscode-github-actions` | 0.32.3 | Útil si algún día se reactivan Actions (hoy bloqueado) |
| `ms-vscode.powershell` | 2025.4.0 | **Sí** — resaltado/validación de los `.ps1` |
| `github.codespaces` | 1.18.17 | No |
| `github.remotehub` | 0.66.0 | No |
| `ms-vscode.azure-repos` | 0.40.0 | No |
| `ms-vscode.remote-repositories` | 0.44.0 | No |
| `ms-azuretools.vscode-azureresourcegroups` | 0.13.3 | No |
| `ms-azuretools.vscode-azurevirtualmachines` | 0.6.11 | No |
| `ms-dotnettools.csdevkit` | 3.40.215 | No |
| `ms-dotnettools.csharp` | 2.160.4 | No |
| `ms-dotnettools.vscode-dotnet-runtime` | 3.2.0 | No |
| `ms-python.python` | 2026.10.0 | No |
| `ms-python.vscode-pylance` | 2026.4.1 | No |
| `ms-python.debugpy` | 2026.6.0 | No |
| `ms-python.vscode-python-envs` | 1.44.0 | No |
| `ms-vscode.vscode-chat-customizations-evaluations` | 1.0.9 | No |
| `typescriptteam.native-preview` | 1.0.2 | No |
| `vscjava.vscode-gradle` | 3.19.0 | No |
| `clestdeveloper.intmo` | 0.5.0 | No |
| `denizhandaklr.lodestar` | 0.15.7 | No |
| `denizhandaklr.muse-code-for-copilot` | 0.1.5 | No |
| `ggml-org.llama-vscode` | 0.0.78 | No |
| `hidenobunagai.nvidia-nim-provider` | 0.3.8 | No |
| `laurent00tt.deepseek-v4-vscode-chat` | 0.4.3 | No |
| `mechatroner.rainbow-csv` | 3.24.1 | No |

Listado actualizable con:

```powershell
code --list-extensions --show-versions
```

---

## 12. Scripts de automatización

### `publish-gh-pages.ps1` — publicar el sitio

```powershell
powershell -ExecutionPolicy Bypass -File .\publish-gh-pages.ps1 -CustomDomain
```

Qué hace:

1. Limpia `_site/` (carpeta temporal, ignorada por git).
2. Copia las 5 páginas + `robots.txt` + `sitemap.xml` + `.nojekyll` + `assets/`.
3. Genera `404.html` a partir de `index.html`.
4. Con `-CustomDomain`, copia también `CNAME`.
5. Crea un repo temporal, hace commit y **force-push** a `gh-pages`.
6. GitHub Pages reconstruye en ~1 minuto.

### `build-deploy-zip.ps1` — ZIP para hosting Apache/cPanel

```powershell
powershell -ExecutionPolicy Bypass -File .\build-deploy-zip.ps1
```

Genera `zavala-ashane-deploy.zip` (~2,4 MB, 43 entradas) con las 5 páginas, `assets/`,
`robots.txt`, `sitemap.xml`, `.htaccess` y `_redirects`. Excluye `_source/`, `.git`,
documentación, scripts, `netlify.toml`, `CNAME`, `.nojekyll` y `_site/`.
Usa la API de .NET para que las rutas internas del ZIP usen `/` (Compress-Archive de
PowerShell 5.1 escribe `\` y rompe la extracción en servidores).

---

## 13. Inventario de archivos (raíz del repo)

| Archivo | KB | Función |
| --- | --- | --- |
| `index.html` | 53,7 | Home de una sola página (hero, servicios, proyectos, testimonios, contacto) |
| `about.html` | 20,9 | Empresa, filosofía, valores, fundador |
| `our-impact.html` | 18,8 | "Building Beyond Homes" |
| `3824-mystic-circle.html` | 20,0 | Ficha de propiedad |
| `3814-treasure-island-drive.html` | 22,0 | Ficha de propiedad |
| `robots.txt` | 0,1 | Directivas para buscadores |
| `sitemap.xml` | 0,9 | 5 URLs con el dominio real |
| `.htaccess` | 2,4 | Apache: HTTPS/canonical, 404 amigable, cache, compresión, headers |
| `_redirects` | 1,2 | Equivalente para Netlify |
| `netlify.toml` | 1,4 | Config Netlify (publish `.` + headers) |
| `CNAME` | 0,03 | Dominio personalizado para GitHub Pages |
| `.nojekyll` | 0 | Desactiva Jekyll en GitHub Pages |
| `publish-gh-pages.ps1` | 2,6 | **Script de publicación actual** |
| `build-deploy-zip.ps1` | 2,4 | Genera el ZIP de despliegue |
| `.gitignore` | 0,3 | Excluye `_source/`, ZIP, `_site/`, archivos de sistema |
| `README.md` | 17,1 | Descripción técnica del proyecto |
| `DEPLOY.md` | 14,4 | Guía de despliegue por rutas (A/B/C/D) |
| `PENDIENTES.md` | 32,3 | Contenido pendiente del cliente |
| `MANUAL.md` | este archivo | Manual maestro |
| `zavala-ashane-deploy.zip` | 2.445,6 | ZIP generado (ignorado por git) |
| `_source/` | — | **29 archivos originales del cliente — NO está en git** |
| `assets/` | — | CSS, fuentes, imágenes, JS |

### `assets/`

| Tipo | Archivos | Peso |
| --- | --- | --- |
| `.css` | 6 | 81,1 KB |
| `.woff2` | 7 | 152,3 KB |
| `.js` | 3 | 53,2 KB |
| `.jpg` | 7 | 878,0 KB |
| `.jpeg` | 7 | 1.260,7 KB |
| `.png` | 4 | 101,9 KB |

Imágenes (18): `apple-touch-icon.png`, `favicon-32.png`, `logo.png`, `logohome.png`,
`hero.jpg`, `og-image.jpg`, `residential-construction.jpg`, `commercial-construction.jpg`,
`remodeling-renovation.jpg`, `property-card-mystic-circle.jpg`,
`property-card-treasure-island.jpg`, `mystic-circle.jpeg`, `mystic-living-kitchen.jpeg`,
`mystic-primary-bathroom.jpeg`, `mystic-primary-bedroom.jpeg`,
`treasure-island-exterior.jpeg`, `treasure-island-kitchen-dining.jpeg`,
`treasure-island-primary-bedroom.jpeg`.

### ⚠️ `_source/` — respaldo obligatorio

Contiene los **originales del cliente** (logo, fotos de obra, fotos de las propiedades,
capturas antes/después, fotos stock archivadas y `fetch-stock-photos.ps1`). **No está en
GitHub** (excluido por `.gitignore`) y **no se publica**. Si esta PC se pierde, esos
originales se pierden con ella: **copiarlos a un disco externo o a la nube.**

---

## 14. Proveedores externos y para qué sirve cada uno

| Proveedor | Servicio contratado | Costo | Crítico |
| --- | --- | --- | --- |
| **GitHub** | Repo + Pages + HTTPS | Gratis | Sí (hosting y código) |
| **GoDaddy** | Registro del dominio + DNS + forwarding | Anual (dominio) | Sí (sin dominio no hay web ni correo) |
| **Microsoft 365** | Correo `info@…` | Suscripción | Sí (correo) |
| **Let's Encrypt** | Certificado HTTPS del apex | Gratis (automático vía GitHub) | No (se renueva solo) |
| **Netlify** | Preview del sitio (legado) | Gratis | No |
| **GoDaddy Website Builder** | 2 sitios de prueba (uno vencido) | Gratis/vencido | No |
| **Unsplash** | Fotos stock actuales de proyecto | Gratis (licencia Unsplash) | No (deben reemplazarse por fotos reales) |
| **LinkedIn** | Perfil del fundador enlazado | Gratis | No |

---

## 15. Cronología del incidente (por qué cambió todo)

| Fecha | Hecho |
| --- | --- |
| 9-feb-2026 | Se registra el dominio en GoDaddy. |
| Antes de 16-nov-2026 | El sitio se publica en Netlify (`preeminent-naiad-7c9ab4.netlify.app`) con DNS externo en GoDaddy (`A @ → 75.2.60.5`). |
| 16-nov-2026 | Se documenta que ese sitio y el dominio devuelven el 404 de Netlify: el proyecto se había eliminado. |
| 21-nov-2026 ~12:01 | Se publica un sitio nuevo por Netlify Drop: `preeminent-moonbeam-ba3b7f.netlify.app` (funciona, pero sin dominio). |
| 21-nov-2026 | Netlify rechaza el dominio: *"already managed by Netlify DNS on another team"*. La cuenta accesible (`lioncarballo@gmail.com`) solo tiene ese team. Sin acceso al team original → Netlify descartado. |
| 21-nov-2026 | Se crea el repo `lioncarballo88/zavala-ashane-builders`, se sube `main`. GitHub Actions falla por bloqueo de facturación → se publica por rama `gh-pages`. |
| 21-nov-2026 | GoDaddy: se reemplaza `A @ 75.2.60.5` por los cuatro A de GitHub; se publica el sitio en el dominio con certificado Let's Encrypt; se fuerza HTTPS. |
| 21-nov-2026 | `www` seguía sin certificado (GitHub emitió solo para el apex) → se configura **forwarding 301** en GoDaddy. Cadena final verificada: `www` → 301 → apex → 301 → `https://` → **200**. |

Historial de commits (rama `main`):

```
a41843b  2026-11-21 14:17  Docs: record www handling via GoDaddy 301 forwarding
db2953b  2026-11-21 13:22  Docs: record the live GitHub Pages setup for zavalaashanebuilders.com
2daa2d9  2026-11-21 12:42  Deploy: publish via gh-pages branch, drop blocked Actions workflow
5ef6518  2026-11-21 12:31  Deploy: add GitHub Pages workflow (Route D) for the custom domain
ad34739  2026-11-16 17:07  Deploy: force-404 internal paths and keep .git out of the ZIP
0b51a97  2026-11-16 17:06  Docs: Git-based Netlify deploy flow
e3bda08  2026-11-16 17:06  Initial commit: static site + Netlify Git deploy config
```

---

## 16. Runbook: tareas habituales

### Cambiar un texto

1. Editar el HTML (texto en inglés).
2. Si el texto existe como clave en `assets/js/i18n-data.js`, actualizar la clave y su
   traducción (o quedará sin traducir).
3. `git add -A && git commit -m "..." && git push origin main`
4. `powershell -ExecutionPolicy Bypass -File .\publish-gh-pages.ps1 -CustomDomain`

### Cambiar/agregar una imagen

1. Optimizarla (JPG calidad ~80, ancho máx. 2000 px para hero, 1200 px para tarjetas).
2. Guardarla en `assets/images/`.
3. Referenciarla en el HTML (y en `og:image` si es la imagen social).
4. Republicar.

### Cambiar CSS o JS

1. Editar el archivo en `assets/css/` o `assets/js/`.
2. **Subir el `?v=N`** de ese archivo en los 5 HTML.
3. Republicar.

### Comprobar salud del sitio

```powershell
$base='https://zavalaashanebuilders.com'
foreach($p in @('/','/about.html','/our-impact.html','/3824-mystic-circle.html','/3814-treasure-island-drive.html','/robots.txt','/sitemap.xml')){
  "{0,-38} {1}" -f $p, (curl.exe -sS -o NUL -w "%{http_code}" "$base$p")
}
```

### Si el sitio devuelve 404 en el dominio

1. ¿Resuelve el DNS? `Resolve-DnsName zavalaashanebuilders.com -Type A` → deben ser
   `185.199.108–111.153`.
2. ¿Pages está en verde? `gh api repos/lioncarballo88/zavala-ashane-builders/pages`
   → `"status": "built"`.
3. ¿Existe `CNAME` en la rama publicada? Si se publicó sin `-CustomDomain`, el dominio se
   pierde: volver a ejecutar el script con el flag.
4. ¿Cambió GoDaddy el `A @`? Comparar con la tabla de la sección 5.

### Si hay que mover el sitio a otro hosting

El paquete estático es `zavala-ashane-deploy.zip` (o la rama `gh-pages`). Se puede subir a
cPanel (con `.htaccess`), Netlify (si se libera el dominio), o cualquier CDN. Solo hay que
cambiar el `A @`/`www` en GoDaddy y volver a emitir el certificado en el host nuevo.

### Si se pierde esta PC

- Código: se recupera de GitHub (`git clone`).
- **`_source/` NO**: hay que restaurarlo desde el respaldo físico. Si no existe, se perdió.

---

## 17. Limitaciones conocidas del hosting actual

| Limitación | Impacto | Mitigación |
| --- | --- | --- |
| GitHub Pages **no permite cabeceras HTTP personalizadas** | No hay `Strict-Transport-Security`, `X-Content-Type-Options` ni `Referrer-Policy` (los que sí define `netlify.toml`) | Aceptable; si se requiere, poner Cloudflare delante (implica mover nameservers y recrear el correo) |
| Caché fija de **10 minutos** para todos los archivos | Los cambios tardan hasta 10 min en verse | Los `?v=N` de CSS/JS evitan el problema en la práctica |
| `.htaccess` y `_redirects` **se ignoran** | Los redirects de esos archivos no aplican | `http→https` lo hace GitHub; `www→apex` lo hace GoDaddy Forwarding; el 404 amigable funciona con `404.html` |
| GitHub Actions bloqueado por facturación | No se puede usar workflows | Se publica por rama (ya implementado) |
| Dominio no verificado en GitHub (`_github-pages-challenge-lioncarballo88` TXT ausente) | Riesgo teórico de *domain takeover* si otro usuario intenta reclamarlo | Opcional: crear ese TXT con el valor que indica GitHub en Settings → Pages |
| Sin `CAA` en DNS | Cualquier CA podría emitir certificados | Opcional: añadir `CAA 0 issue "letsencrypt.org"` y `CAA 0 issue "godaddy.com"` |

---

## 18. Pendientes técnicos y de contenido

Detalle completo en [PENDIENTES.md](./PENDIENTES.md). Resumen:

- ❌ **Imagen rota:** `assets/images/founder-cesar-zavala.jpg` no existe (404 en
  `about.html`, marcada *PHOTO PENDING*).
- ❌ Formulario de contacto oculto y sin endpoint.
- ❌ Teléfono de ejemplo (`832…`) en 16 enlaces `tel:` y en 4 bloques JSON-LD.
- ❌ Correo del sitio: confirmar que `info@zavalaashanebuilders.com` es el buzón correcto.
- ❌ Fotos de proyecto actuales son **stock de Unsplash** (deben ser obras reales).
- ❌ Testimonios de ejemplo.
- ❌ Enlaces a Facebook/Instagram apuntando a `#`.
- ❌ Falta una foto de galería en la ficha de Treasure Island.
- ❌ Registrar el sitio en **Google Search Console** y enviar `sitemap.xml`.
- ❌ Confirmar horario de atención y la línea "Bilingual — English & Español".

---

## 19. Checklist de accesos a respaldar

- [ ] GitHub: usuario `lioncarballo88`, 2FA activo + códigos de recuperación guardados.
- [ ] GoDaddy: usuario/contraseña + 2FA (dominio, DNS, forwarding).
- [ ] Microsoft 365: acceso de administrador al tenant `NETORGFT20339501.onmicrosoft.com`.
- [ ] Netlify: `lioncarballo@gmail.com` (solo para el preview).
- [ ] Copia de seguridad de `_source/` fuera de esta PC.
- [ ] Captura/export de la tabla DNS de GoDaddy (sección 5 de este manual).
- [ ] Renovación automática del dominio activada y tarjeta vigente.
- [ ] Este manual y `DEPLOY.md` también en la nube (están en el repo, que es público).
