# FaceVision — Face Detection, Clustering & Search System

A production-ready image processing pipeline that detects faces, generates identity embeddings, clusters faces by person, and enables face-based image search — all containerised with Docker.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│   React Dashboard  ·  Upload  ·  Clusters  ·  Search           │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP
                    ┌───────▼────────┐
                    │  Nginx :80     │  reverse proxy
                    └──┬──────────┬──┘
                       │          │
              ┌────────▼──┐  ┌────▼──────────┐
              │ Django    │  │ React (nginx) │
              │ REST API  │  │   :3000       │
              │ :8000     │  └───────────────┘
              └─────┬─────┘
                    │
       ┌────────────▼───────────────┐
       │     Processing Pipeline    │
       │                            │
       │  1. BlazeFace (MediaPipe)  │  face detection + 468 landmarks
       │  2. Face Alignment         │  affine warp → 112×112 canonical
       │  3. ArcFace (InsightFace)  │  512-dim identity embedding
       │  4. DBSCAN Clustering      │  cosine-distance grouping
       └────────────┬───────────────┘
                    │
            ┌───────▼──────┐
            │  PostgreSQL  │  images · faces · embeddings · clusters
            └──────────────┘
```

---

## Quick Start

### Prerequisites
- Docker ≥ 24 and Docker Compose v2
- 4 GB RAM minimum (8 GB recommended for model loading)

### 1. Clone & Launch

```bash
git clone <repo-url> facevision
cd facevision
docker compose up --build
```

The first build downloads InsightFace model weights (~300 MB) and may take 10–15 minutes.

### 2. Open

| Service | URL |
|---------|-----|
| Dashboard | http://localhost |
| Django API | http://localhost/api/ |
| Django Admin | http://localhost/admin/ |

---

## Pipeline Detail

### Stage 1 — BlazeFace Detection (MediaPipe FaceMesh)
- Model: `mediapipe.solutions.face_mesh.FaceMesh`
- Returns bounding box + **468 3D facial landmarks** per face
- Supports up to 20 simultaneous faces per image

### Stage 2 — Face Alignment
- 5-point affine transform using MediaPipe landmark indices: `[33, 263, 1, 61, 291]`
  (left eye, right eye, nose tip, mouth-left, mouth-right)
- Warps to 112×112 canonical template used by ArcFace

### Stage 3 — ArcFace Embedding (InsightFace)
- Model: `buffalo_sc` (lightweight CPU-compatible variant)
- Output: **512-dimensional L2-normalised embedding** per face
- Embeddings stored as JSON in PostgreSQL

### Stage 4 — DBSCAN Clustering
- Algorithm: `sklearn.cluster.DBSCAN(metric='cosine')`
- Default: `eps=0.6`, `min_samples=2`
- Cluster label −1 = noise (unclassified faces)
- Re-runs globally on every new image upload

### Search
- Cosine similarity: `sim = dot(q, c)` (both L2-normalised)
- Returns ranked list of (face, similarity) pairs

---

## API Reference

### Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/images/` | List all images (paginated) |
| `POST` | `/api/images/upload/` | Upload images (`multipart/form-data`, field `images`) |
| `GET`  | `/api/images/<id>/` | Single image details + faces + features |
| `DELETE` | `/api/images/<id>/` | Delete image and all faces |

### Clusters

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/clusters/` | List all clusters |
| `GET`  | `/api/clusters/<id>/` | Cluster detail with face thumbnails |
| `PATCH` | `/api/clusters/<id>/` | Label a cluster `{"person_label": "Alice"}` |
| `POST` | `/api/clusters/recluster/` | Re-run DBSCAN over all embeddings |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/search/` | Search similar faces. Body: `query_image` (file) or `image_id` (UUID) + optional `top_k` |

### Utilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/stats/` | Dashboard statistics |
| `GET`  | `/api/health/` | Liveness probe |

---

## Configuration

Environment variables in `docker-compose.yml`:

| Variable | Default | Description |
|----------|---------|-------------|
| `DJANGO_SECRET_KEY` | `change-me-...` | **Change in production** |
| `DJANGO_DEBUG` | `True` | Set `False` in production |
| `DATABASE_URL` | PostgreSQL | Full database URL |
| `MEDIA_ROOT` | `/app/media` | Image storage path |
| `REACT_APP_API_URL` | `http://localhost:8000` | Backend URL for frontend |

---

## Project Structure

```
facevision/
├── backend/
│   ├── core/               Django project (settings, urls, wsgi)
│   ├── api/
│   │   ├── models.py       UploadedImage · DetectedFace · FaceCluster
│   │   ├── pipeline.py     Full ML pipeline (detection→alignment→embedding→clustering)
│   │   ├── serializers.py  DRF serializers
│   │   ├── views.py        REST API views
│   │   └── urls.py         URL routing
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     UI · Sidebar · ResultsTable · UploadZone · ClustersGrid · SearchPanel
│   │   ├── pages/          Dashboard · Upload · Clusters · Search
│   │   ├── utils/api.js    Axios API client
│   │   └── styles/         CSS design tokens
│   ├── package.json
│   └── Dockerfile
├── nginx/
│   └── nginx.conf          Reverse proxy config
└── docker-compose.yml
```

---

## Development

### Backend (without Docker)

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=sqlite:///db.sqlite3
python manage.py migrate
python manage.py runserver
```

### Frontend (without Docker)

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

---

## Performance Notes

- MediaPipe runs on CPU; typical latency ~100–500ms per image depending on face count
- InsightFace `buffalo_sc` is the smallest model variant — swap for `buffalo_l` for higher accuracy
- DBSCAN re-clusters all faces on every upload; for >10k faces consider batching or incremental clustering
- Embeddings stored as JSON TEXT; migrate to `pgvector` for production-scale cosine search

---

## License

MIT
