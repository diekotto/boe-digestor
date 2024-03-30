# Boe Digestor

Aplicación que resume pdfs del BOE.

# ;TLDR;

Mediante la integración con el API de Claude AI, se ha creado una aplicación que permite resumir los pdfs del BOE.

# ¿Qué es el BOE?

El Boletín Oficial del Estado (BOE) es el diario oficial del Estado español y el medio de difusión de las leyes, disposiciones y actos de las administraciones públicas.

# ¿Qué es el Boe Digestor?

Es una aplicación que permite resumir los pdfs del BOE. Para ello, se ha integrado con el API de Claude Haiku, que permite resumir textos.

# Instalación

Para instalar la aplicación, se debe clonar el repositorio y ejecutar el siguiente comando:

```bash
yarn install
```

# Uso

Para usar la aplicación, se debe ejecutar el siguiente comando:

```bash
yarn start
```

# Patrones de publicación web del BOE

### Vamos a analizar los sumarios del BOE, no los pdfs individuales.

Las url de los sumarios del BOE siguen el siguiente patrón:

> https://boe.es/boe/dias/\<year\>/\<month\>/\<day\>/pdfs/BOE-S-\<year\>-\<count\>.pdf
