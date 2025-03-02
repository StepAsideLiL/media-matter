# Media Matter

A nodejs server to upload media files in S3 like object storage service MinIO and download them.

## Getting Started

### Prerequisites

- Nodejs >= v20
- PNPM >= v9
- Docker >= v27

### Installation

1. Clone the repository

```bash
git clone https://github.com/StepAsideLiL/media-matter.git
```

2. Install dependencies

```bash
pnpm install
```

3. Run the docker-compose file in `apps/server` directory

```bash
# Run docker
docker compose --project-name media-matter-server up -d
```

> [!NOTE]
>
> ```bash
> # Remove docker instance
> docker compose --project-name media-matter-server down
> ```

4. Go to `http://127.0.0.1:9001`. Use `admin` as username and `adminadmin` as password to login MinIO backend.
5. Go to `http://127.0.0.1:9001/buckets` and create a bucket called `media-matter`.
6. Then go to `http://127.0.0.1:9001/buckets/media-matter/admin/prefix` and add access rule.

```yaml
Prefix: /
Access: readonly
```

7. Now you can build and run the both server and client

```bash
pnpm build # Build the project both server and client

pnpm start # Run the project both server and client

pnpm build && pnpm start # Build and run
```

> [!NOTE]
>
> `ctrl + c` to stop the server

#### Let me know if you face any issues.
