# PulseScope — Tableau de bord NPS & Customer Health Score en temps réel

> Mesurez la satisfaction client au moment où elle change. Pas après qu'elle soit perdue.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis)](https://redis.io)

---

## Vue d'ensemble

PulseScope est une plateforme de mesure de la satisfaction client (NPS, CSAT, CES) et de health scoring en temps réel. Elle collecte les retours clients via des enquêtes déclenchées par des événements (post-achat, après support, à 30/60/90 jours), calcule un Customer Health Score composite, et alerte les équipes Customer Success sur les comptes à risque.

**Domaine :** Customer Success / CX Analytics  
**Port VM :** 3001 | **Sous-domaine :** pulsescope.wikolabs.com

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Recharts | Dashboard NPS, health scores, alertes churn |
| Backend | FastAPI (Python 3.11), Uvicorn | API enquêtes, scoring, webhooks |
| Base de données | PostgreSQL 16 | Réponses enquêtes, scores historiques |
| Cache / Real-time | Redis 7 | Pub/Sub pour alertes live, cache scores |
| Scheduler | APScheduler | Envoi automatique des enquêtes event-driven |
| Email | SMTP (Resend) | Livraison des surveys |
| Infra | Docker Compose, Nginx | VM mono-repo (port 3001) |

### backend/requirements.txt
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
asyncpg==0.29.0
sqlalchemy[asyncio]==2.0.30
redis==5.0.4
apscheduler==3.10.4
pydantic==2.7.1
pandas==2.2.2
numpy==1.26.4
python-dotenv==1.0.1
resend==0.7.2
```

---

## Architecture mono-repo

```
pulsescope/
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx             # Dashboard principal NPS + CHS
│   │   ├── surveys/             # Gestion campagnes
│   │   ├── accounts/[id]/       # Profil compte + historique score
│   │   └── alerts/              # File d'alertes churn
│   └── src/components/
│       ├── NpsGauge.tsx         # Jauge NPS -100 à +100
│       ├── HealthScoreCard.tsx  # Score composite 0-100
│       ├── TrendChart.tsx       # Recharts NPS trend 12 mois
│       ├── AlertBanner.tsx      # Compte à risque (CHS < 40)
│       └── SurveyPreview.tsx    # Preview email enquête
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── surveys.py       # CRUD campagnes + réponses
│   │   │   ├── scores.py        # GET /health-score/{account_id}
│   │   │   └── alerts.py        # GET /alerts (comptes à risque)
│   │   ├── services/
│   │   │   ├── nps_engine.py    # Calcul NPS, CSAT, CES
│   │   │   ├── health_score.py  # Score composite pondéré
│   │   │   ├── scheduler.py     # Envoi surveys event-driven
│   │   │   └── alerting.py      # Redis Pub/Sub alertes
│   │   └── models/
│   │       ├── survey.py
│   │       └── account.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

---

## Diagrammes UML

### Architecture système

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0891b2', 'primaryTextColor': '#fff', 'primaryBorderColor': '#0e7490', 'lineColor': '#374151', 'secondaryColor': '#ecfeff'}}}%%
flowchart TB
    subgraph VM["🖥️ VM — Docker Compose (port 3001)"]
        NEXT["Next.js 14\nDashboard NPS/CHS"]
        API["FastAPI"]
        SCHED["APScheduler\nEvent-driven surveys"]

        subgraph SCORING["📊 Moteur scoring"]
            NPS["NPS Engine\nPromoters - Detractors"]
            CHS["Health Score\n6 dimensions"]
            ALERT["Alerting\nChurn risk < 40"]
        end

        PG[("PostgreSQL\nSurveys + Scores")]
        REDIS[("Redis 7\nPub/Sub + Cache")]
    end

    EMAIL["Resend SMTP\nEmail delivery"] --> SCHED
    SCHED --> API
    API --> SCORING
    SCORING --> REDIS
    REDIS --> NEXT
    API --> PG
```

### Séquence — Réception d'une réponse NPS

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0891b2', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
sequenceDiagram
    participant CLIENT as Client
    participant API as FastAPI
    participant NPS as NPS Engine
    participant CHS as Health Score
    participant REDIS as Redis
    participant CS as CS Team

    CLIENT->>API: POST /surveys/{id}/respond {score: 4, comment: "..."}

    API->>NPS: compute_nps(account_id, score=4)
    NPS-->>API: nps_category=PASSIVE, account_nps=-12

    API->>CHS: update_health_score(account_id)
    Note over CHS: 6 dims: NPS 25%, usage 30%, support 20%, payment 15%, engagement 10%
    CHS-->>API: health_score=38, delta=-8, risk=HIGH

    API->>REDIS: PUBLISH alerts:churn {account_id, score=38}
    REDIS-->>CS: push notification (SSE)

    API-->>CLIENT: {survey_id, status: "recorded", next_survey: "90d"}
```

### Modèle de données (ER)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0891b2', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
erDiagram
    ACCOUNT {
        uuid id PK
        string name
        string tier
        float health_score
        string risk_level
        timestamp last_survey_at
    }
    SURVEY_CAMPAIGN {
        uuid id PK
        string type
        string trigger_event
        int delay_days
        string status
    }
    SURVEY_RESPONSE {
        uuid id PK
        uuid account_id FK
        uuid campaign_id FK
        int nps_score
        string comment
        string category
        timestamp responded_at
    }
    HEALTH_SCORE_HISTORY {
        uuid id PK
        uuid account_id FK
        float score
        jsonb dimensions
        timestamp computed_at
    }

    ACCOUNT ||--o{ SURVEY_RESPONSE : "receives"
    SURVEY_CAMPAIGN ||--o{ SURVEY_RESPONSE : "generates"
    ACCOUNT ||--o{ HEALTH_SCORE_HISTORY : "tracks"
```

---

## PRD

### Problème
Les équipes CS découvrent le churn après le fait. Les NPS annuels ne permettent pas de détecter la dégradation progressive d'un compte. Il manque un Health Score multi-dimensionnel qui combine satisfaction, usage produit, et comportement de paiement.

### Solution
PulseScope déclenche des micro-surveys NPS à des moments clés (post-feature-launch, post-incident, J+30 onboarding), calcule un Health Score composite en temps réel, et alerte le CS Manager quand un compte passe sous le seuil de risque.

### Utilisateurs cibles
| Persona | Besoin |
|---------|--------|
| Customer Success Manager | Voir les comptes à risque avant qu'ils churent |
| CX Analyst | Analyser les tendances NPS par segment/produit |
| Product Manager | Corréler les releases avec les variations NPS |

### OKRs
- Alerte churn < 24h après dégradation du score
- Taux de réponse survey > 35% (vs 12% industrie)
- Réduction churn préventif de 20% via interventions early

---

## User Stories

```
US-01 [CSM] En tant que Customer Success Manager,
      je veux voir en un coup d'œil les 10 comptes avec le CHS le plus bas
      afin de prioriser mes interventions de la semaine.

US-02 [Analyst] En tant qu'analyste CX,
      je veux comparer le NPS de 3 segments clients sur 12 mois
      afin d'identifier quel segment se dégrade le plus vite.

US-03 [PM] En tant que Product Manager,
      je veux voir l'impact sur le NPS de chaque release
      afin de prouver que mes nouvelles features améliorent la satisfaction.

US-04 [Système] En tant que scheduler,
      je veux envoyer une enquête NPS automatiquement 30 jours après onboarding
      afin de mesurer la satisfaction à l'adoption initiale.

US-05 [CSM] En tant que CSM,
      je veux recevoir une alerte push quand un compte Gold passe en CHS < 40
      afin d'intervenir avant l'expiration du contrat.
```

---

## Règles métier

| # | Règle | Description | Simulable UI |
|---|-------|-------------|-------------|
| R1 | Calcul NPS | (Promoteurs% - Détracteurs%) × 100 | ✅ Jauge live |
| R2 | Catégories NPS | 9-10=Promoteur, 7-8=Passif, 0-6=Détracteur | ✅ Badge couleur |
| R3 | Health Score | 6 dimensions pondérées (NPS 25%, usage 30%, support 20%, paiement 15%, engagement 10%) | ✅ Radar chart |
| R4 | Seuil alerte | CHS < 40 = RISK, < 60 = WARNING, ≥ 60 = HEALTHY | ✅ Traffic light |
| R5 | Cooldown survey | Min 30 jours entre 2 surveys pour un même compte | ✅ Timeline |
| R6 | Triggers auto | post_purchase, post_support_close, day30, day90, pre_renewal | ✅ Trigger list |
| R7 | Segmentation | Tier (Enterprise/SMB/Startup) × NPS trend → cohort | ✅ Segment filter |
| R8 | Détracteur action | Score ≤ 6 → tâche CS créée automatiquement dans 24h | ✅ Task simulate |
| R9 | Tendance score | Δ CHS > -10 sur 30j → alerte urgente | ✅ Delta badge |
| R10 | Score anonyme | Réponses agrégées min 5 par segment (RGPD) | ✅ Blur demo |

---

## Spécification API

**Base URL :** `http://pulsescope.wikolabs.com/api/v1`

### POST /surveys/{campaign_id}/respond
```json
{"account_id": "acc_123", "score": 8, "comment": "Produit excellent mais support lent"}
// Response: {"survey_id": "sr_xyz", "nps_category": "PASSIVE", "health_score": 62}
```

### GET /accounts/{id}/health-score
```json
// Response: {
//   "account_id": "acc_123",
//   "health_score": 62,
//   "risk_level": "WARNING",
//   "dimensions": {"nps": 75, "usage": 60, "support": 45, "payment": 90, "engagement": 55},
//   "trend_30d": -8
// }
```

### GET /alerts
```json
// Response: {"alerts": [{"account_id": "acc_456", "health_score": 32, "risk": "HIGH", "last_nps": 4}]}
```

---

## Simulation UI

| Composant | Description |
|-----------|-------------|
| **NPS Gauge** | Jauge animée -100 à +100, couleur verte/orange/rouge selon score |
| **Health Score Radar** | 6 axes : NPS, usage, support, paiement, engagement, ancienneté |
| **Trend Chart** | Recharts line chart 12 mois avec zones colorées (risk/warning/healthy) |
| **Alert Queue** | Liste des comptes à risque avec CTA "Contacter maintenant" |
| **Survey Preview** | Preview email avec score 0-10 cliquable (mock submit) |
| **Segment Comparison** | Compare NPS Enterprise vs SMB vs Startup sur période |

---

## Déploiement

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment: {POSTGRES_DB: pulsescope, POSTGRES_USER: ps_user, POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"}
    volumes: [pg_data:/var/lib/postgresql/data]
  redis:
    image: redis:7-alpine
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://ps_user:${POSTGRES_PASSWORD}@postgres/pulsescope
      REDIS_URL: redis://redis:6379
    depends_on: [postgres, redis]
    expose: ["8000"]
  frontend:
    build: ./frontend
    expose: ["3000"]
  nginx:
    image: nginx:alpine
    ports: ["3001:80"]
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf:ro"]
volumes:
  pg_data:
```

---

## Roadmap

### Phase 1 — MVP
- [ ] Enquêtes NPS déclenchées manuellement
- [ ] Dashboard NPS + Health Score
- [ ] Alertes email (CHS < 40)

### Phase 2 — Automatisation
- [ ] Triggers event-driven (post-achat, post-support)
- [ ] Segmentation par tier et cohorte
- [ ] Intégration CRM (NexusCRM webhook)

### Phase 3 — Intelligence
- [ ] Prédiction churn ML (30 jours)
- [ ] Analyse sentiment des verbatims (DistilBERT)
- [ ] Benchmark sectoriel NPS

---

*Un produit [Wikolabs](https://wikolabs.com) — Intelligence artificielle appliquée aux métiers*
