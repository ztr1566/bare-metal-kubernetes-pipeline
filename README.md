# Bare-Metal Kubernetes CI/CD Pipeline

A complete enterprise-grade DevOps platform showcasing modern CI/CD practices, GitOps deployment, and comprehensive monitoring for Node.js applications on Kubernetes.

## 🏗️ Architecture Overview 

```mermaid
flowchart TD
    %% Git Repository
    A[📁 Git Repository<br/>k8s-node-project] --> B[🔄 Jenkins Pipeline]

    %% CI/CD Pipeline Stages
    B --> C[🏁 Stage 1: Initialize<br/>Git commit + Build number]
    C --> D[🔒 Stage 2: Security Scan<br/>Snyk SAST/SCA]
    D --> E[🧪 Stage 3: Lint & Test<br/>Node.js 24-alpine]  
    E --> F[🏗️ Stage 4: Build & Push<br/>Kaniko Rootless Build]  
    F --> G[🛡️ Stage 5: Container Scan<br/>Trivy Vulnerability Scan]
    G --> H[🚀 Stage 6: GitOps Deploy<br/>kubectl Update Manifests]

    %% Infrastructure
    I[⚙️ Ansible Automation] --> J[🎯 Kubernetes Cluster<br/>Master + Worker Nodes]

    %% GitOps Flow
    H --> A
    A --> K[📋 ArgoCD<br/>App-of-Apps Pattern]
    K --> L[🔄 Auto Sync<br/>kubernetes/apps/]
    L --> J

    %% Application Deployment
    J --> M[📦 Node.js Application<br/>Express + Custom Metrics]

    %% Container Registry
    F --> N[🐳 Docker Hub<br/>zizoo1566/my-node-app]
    N --> K

    %% Monitoring Stack
    M --> O[📊 Prometheus<br/>Metrics Collection]
    O --> P[📈 Grafana<br/>Visualization Dashboards]

    %% Styling
    classDef gitClass fill:#ff6b6b,stroke:#ff4757,stroke-width:2px,color:#fff
    classDef pipelineClass fill:#4834d4,stroke:#3742fa,stroke-width:2px,color:#fff
    classDef infraClass fill:#00d2d3,stroke:#01a3a4,stroke-width:2px,color:#fff
    classDef appClass fill:#ff9ff3,stroke:#f368e0,stroke-width:2px,color:#fff
    classDef monitorClass fill:#feca57,stroke:#ff9f43,stroke-width:2px,color:#333

    class A gitClass
    class B,C,D,E,F,G,H pipelineClass
    class I,J,K,L infraClass
    class M,N appClass
    class O,P monitorClass
```

This project demonstrates a production-ready DevOps pipeline that transforms code commits into deployed applications through automated testing, security scanning, building, and deployment processes.

## 🚀 Features

- **Infrastructure as Code**: Automated Kubernetes cluster provisioning with Ansible
- **Multi-Stage CI/CD Pipeline**: Jenkins with Node.js, Kaniko, Trivy, and Snyk integration
- **GitOps Deployment**: ArgoCD App-of-Apps pattern for declarative continuous deployment
- **DevSecOps Integration**: Comprehensive security scanning with Snyk (SAST/SCA) and Trivy (Container scanning)
- **Comprehensive Monitoring**: Prometheus metrics collection with Grafana visualization
- **Production-Ready**: Scalable architecture designed for enterprise environments

## 🛠️ Technology Stack

### Infrastructure & Orchestration
- **Kubernetes**: Container orchestration platform with kubeadm
- **Ansible**: Infrastructure automation and configuration management  
- **Ubuntu VMs**: Production-grade server infrastructure

### CI/CD Pipeline Components
- **Jenkins**: Automation server with Kubernetes agents
- **Node.js 24-Alpine**: Application runtime and testing environment
- **Kaniko**: Secure rootless container image building
- **Trivy**: Container vulnerability scanning
- **Snyk**: SAST (Static Application Security Testing) and SCA (Software Composition Analysis)
- **Kubectl**: Kubernetes cluster management

### GitOps & Deployment
- **ArgoCD**: GitOps continuous delivery with App-of-Apps pattern
- **Docker Hub**: Container registry (zizoo1566/my-node-app)

### Application Stack
- **Node.js/Express**: Backend application framework
- **Custom Metrics**: Application performance monitoring integration
- **ESLint**: Code quality and consistency

### Monitoring & Observability
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Metrics visualization and dashboards
- **ServiceMonitor**: Custom application metrics discovery

## 📁 Project Structure

```
k8s-node-project/
├── .github/                    # GitHub Actions workflows
├── ansible/                    # Infrastructure automation
│   ├── inventory/              # Server inventory configuration
│   ├── playbooks/              # Ansible automation playbooks
│   │   ├── setup_cluster.yml   # Main cluster setup orchestrator
│   │   ├── 02-build_cluster.yml # Cluster initialization
│   │   ├── 03-setup_storage.yml # Storage configuration
│   │   └── reset_nodes.yml     # Cluster reset utility
│   └── roles/                  # Ansible roles for modular configuration
├── app/                        # Node.js application
│   ├── src/                    # Application source code
│   ├── views/                  # Template files
│   ├── public/                 # Static assets
│   ├── Dockerfile              # Container build instructions
│   ├── package.json            # Node.js dependencies
│   └── eslint.config.cjs       # Code quality configuration
├── jenkins/                    # CI/CD pipeline configuration
│   ├── Jenkinsfile             # Declarative pipeline definition
│   └── vars/                   # Jenkins shared library functions
├── kubernetes/                 # Kubernetes manifests
│   ├── apps/                   # Application definitions for ArgoCD
│   ├── argocd/                 # GitOps configuration
│   │   └── app-of-apps.yaml    # ArgoCD App-of-Apps pattern
│   ├── manifests/              # Kubernetes resource definitions
│   └── monitoring/             # Monitoring stack configuration
└── ansible.cfg                 # Ansible global configuration
```

## 🔧 Deployment Guide

### Prerequisites
- Ubuntu VMs (1 Master, 1+ Worker nodes) with minimum 2GB RAM each
- Ansible installed on control machine
- Docker Hub account and credentials
- Git repository access

### 1. Infrastructure Setup with Ansible

#### Configure Inventory
```bash
# Edit the inventory file
vim ansible/inventory/hosts

# Add your server details:
[masters]
k8s-master ansible_host=YOUR_MASTER_IP ansible_user=ubuntu

[workers]
k8s-worker1 ansible_host=YOUR_WORKER_IP ansible_user=ubuntu
```

#### Deploy Kubernetes Cluster
```bash
# Run the complete cluster setup
ansible-playbook ansible/playbooks/setup_cluster.yml

# What this does:
# 1. Installs containerd runtime
# 2. Configures networking and disables swap  
# 3. Installs Kubernetes packages (kubelet, kubeadm, kubectl)
# 4. Initializes master node with kubeadm
# 5. Joins worker nodes to the cluster
# 6. Sets up storage classes and networking
```

#### Ansible Roles Structure
The playbook uses modular roles for:
- **Common setup**: Base system configuration
- **Container runtime**: containerd installation and configuration
- **Kubernetes installation**: Package management and system prep
- **Master initialization**: Cluster bootstrap with kubeadm
- **Worker joining**: Node registration and network setup

### 2. CI/CD Pipeline with Jenkins

#### Jenkins Setup
```bash
# Install Jenkins using Helm
helm repo add jenkins https://charts.jenkins.io
helm install jenkins jenkins/jenkins -n jenkins --create-namespace

# Get admin password
kubectl get secret --namespace jenkins jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 --decode; echo
```

#### Required Jenkins Plugins
The pipeline requires these plugins:
- **Kubernetes Plugin**: For dynamic agent provisioning
- **Pipeline Plugin**: Declarative pipeline support  
- **Credentials Plugin**: Secret management
- **Git Plugin**: Source code integration
- **Docker Pipeline Plugin**: Container operations

#### Pipeline Configuration
The `jenkins/Jenkinsfile` implements a comprehensive 6-stage pipeline:

**Stage 1: Initialize**
- Generates unique image tags using Git commit + build number
- Sets environment variables for downstream stages

**Stage 2: Security Scan (SAST & SCA)**
- **Container**: `snyk/snyk:docker`
- **SAST**: Static code analysis for security vulnerabilities
- **SCA**: Dependency vulnerability scanning
- **Threshold**: Fails on HIGH severity issues

**Stage 3: Lint & Test**  
- **Container**: `node:24-alpine`
- Runs ESLint for code quality
- Executes application tests
- Validates package dependencies

**Stage 4: Build & Push Image**
- **Container**: `gcr.io/kaniko-project/executor:v1.11.0-debug`
- Builds container image from `app/Dockerfile`
- Pushes to Docker Hub registry
- Uses Kaniko for rootless, secure builds
- Returns image digest for security scanning

**Stage 5: Container Security Scan**
- **Container**: `aquasec/trivy:latest`  
- Scans built image for vulnerabilities
- **Severity**: Fails on HIGH/CRITICAL findings
- Uses image digest for accurate scanning

**Stage 6: GitOps Deployment**
- **Container**: `bitnami/kubectl:latest`
- Updates Kubernetes manifests with new image
- Commits changes back to Git repository
- Triggers ArgoCD synchronization

#### Jenkins Kubernetes Agent Configuration
```yaml
# The pipeline uses dynamic Kubernetes agents with:
apiVersion: v1
kind: Pod
spec:
  imagePullSecrets:
  - name: dockerhub-secret  # Docker Hub credentials
  containers:
  - name: node              # Node.js runtime for testing
  - name: kaniko            # Secure container builds
  - name: kubectl           # Kubernetes operations  
  - name: trivy             # Container security scanning
  - name: snyk              # Code security analysis
  - name: git               # Push updated image to master branch
```

### 3. GitOps with ArgoCD App-of-Apps Pattern

#### Install ArgoCD
```bash
# Install ArgoCD in dedicated namespace
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

kubectl get secret --namespace argocd argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode; echo

# Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

#### Deploy App-of-Apps Pattern
```bash
# Apply the root application
kubectl apply -f kubernetes/argocd/app-of-apps.yaml
```

#### What Happens After Applying app-of-apps.yaml:

1. **Root Application Creation**: ArgoCD creates a root application named `root-app`

2. **Repository Monitoring**: ArgoCD monitors the `kubernetes/apps` directory in your Git repository

3. **Automatic Discovery**: Any new application manifests added to `kubernetes/apps` are automatically discovered and deployed

4. **Recursive Deployment**: The App-of-Apps pattern enables:
   - **Self-Management**: ArgoCD manages its own application definitions
   - **Scalability**: Easy addition of new applications without manual ArgoCD configuration  
   - **Consistency**: All applications follow the same GitOps workflow
   - **Automated Sync**: Changes in Git trigger automatic cluster synchronization

5. **Sync Policy Features**:
   - **Automated Pruning**: Removes resources deleted from Git
   - **Self-Healing**: Reverts manual cluster changes to match Git state
   - **Continuous Monitoring**: Ensures cluster state matches repository state

This pattern transforms your Git repository into the single source of truth for all Kubernetes deployments, enabling true GitOps practices.

### 4. Application Deployment

The Node.js application (`app/` directory) includes:
- **Express.js server** with custom metrics endpoint
- **Multi-stage Dockerfile** for optimized container builds
- **Health checks** and readiness probes
- **Environment-based configuration**
- **Static asset serving** from `public/` directory
- **Template rendering** using view engine

### 5. Monitoring Stack

#### Prometheus Setup
```bash
# Install Prometheus Operator
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

#### Custom Application Metrics
The monitoring configuration includes:
- **ServiceMonitor**: Automatic metrics discovery for the Node.js app
- **Custom Dashboards**: Application-specific Grafana dashboards
- **Alerting Rules**: Production-ready alert configurations
- **Namespace Monitoring**: Complete observability across all components

## 🔀 Branching Strategy and CI/CD Workflow

To ensure a stable and automated process **without CI loops**, this project follows a specific **Git branching model** that separates development work from production deployments.

### Branching Model

#### `development` Branch
The primary branch for all active development work. All new features, bug fixes, and changes **must be pushed here only**. This is where developers collaborate and where the CI/CD pipeline is triggered.

**Key Characteristics:**
- Active development branch
- Monitored by Jenkins for automated builds
- Receives all direct developer commits
- Serves as the integration point for new code

#### `master` Branch  
The **source of truth for production deployments**. This branch is continuously monitored by ArgoCD for automated synchronization and deployment to the Kubernetes cluster.

**Key Characteristics:**
- Production-ready code only
- Monitored by ArgoCD for GitOps sync
- **No direct developer pushes allowed**
- Updated exclusively by the Jenkins pipeline
- Contains the definitive Kubernetes manifests

### Automated Pipeline Workflow

The entire process is triggered by a single push to the `development` branch, creating a fully automated deployment pipeline:

#### 1. Trigger Event
A developer pushes code to the `development` branch, initiating the automated workflow.

#### 2. Jenkins Pipeline Execution
The Jenkins pipeline is configured to listen exclusively on the `development` branch and starts automatically upon detecting changes.

#### 3. Build & Test Stages

**Stage 2: Security Scan (Code)**
- Snyk performs Static Application Security Testing (SAST)
- Software Composition Analysis (SCA) scans all dependencies
- Pipeline fails on HIGH severity vulnerabilities

**Stage 3: Lint & Test**
- Executes `npm run lint` for code quality validation
- Runs `npm test` to verify application correctness
- Ensures code meets quality standards before proceeding

**Stage 4: Build & Push Docker Image**
- Kaniko builds a Docker image securely (rootless)
- Tags image uniquely using Git commit SHA and build number
- Pushes tagged image to Docker Hub registry
- Returns image digest for security scanning

**Stage 5: Security Scan (Image)**
- Trivy scans the newly built Docker image
- Identifies vulnerabilities in the container layers
- Pipeline fails on HIGH/CRITICAL findings

#### 4. Automated GitOps Deployment

**Stage 6: Update Production Manifests**
- Pipeline checks out the `master` branch
- Merges approved changes from `development` into `master`
- Updates `kubernetes/manifests/deployment.yaml` with the new image tag
- Commits the updated manifest with descriptive commit message
- Pushes the updated `master` branch back to GitHub

#### 5. ArgoCD Synchronization
- ArgoCD continuously monitors the `master` branch
- Detects the updated Kubernetes manifest
- Automatically syncs the cluster state with Git
- Deploys the new application version with zero manual intervention

> **CI Loop Prevention**: This workflow is fully automated and **prevents CI loops** because the push to `master` does **not** trigger Jenkins builds. Jenkins only responds to `development` branch changes, while ArgoCD only responds to `master` branch changes, creating a clean separation of concerns.

### Developer Workflow

To contribute effectively and maintain the integrity of the branching strategy, follow this development cycle:

#### 1. Sync Your Local Repository
Before starting new work, ensure your local `development` branch is up-to-date:

```bash
# Switch to development branch
git checkout development

# Pull latest changes (which may include automatic updates from master)
git pull origin development

# Optional: Sync with master to get latest production state
git pull origin master
```

#### 2. Develop and Test Locally
```bash
# Create a feature branch (optional but recommended)
git checkout -b feature/your-feature-name

# Make your changes
# ... edit files ...

# Test locally
npm install
npm run lint
npm test
```

#### 3. Commit and Push to Development
```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add new feature description"

# Push to development branch
git push origin development
```

#### 4. Monitor Pipeline Execution
- Check Jenkins for pipeline execution status
- Review security scan results
- Verify all stages pass successfully
- Monitor ArgoCD for deployment status

#### 5. Verify Deployment
```bash
# Check application status in Kubernetes
kubectl get pods -n your-namespace

# View application logs
kubectl logs -f deployment/my-node-app -n your-namespace

# Access application
# kubectl port-forward svc/my-node-app 3001:3001 -n your-namespace --> Updated service to NodePort at 30007. Ignore this step.
```


### Branch Protection Rules

To enforce this workflow, configure the following branch protection rules in your Git repository:

**`master` Branch Protection:**
- Require pull request reviews before merging
- Require status checks to pass (Jenkins pipeline)
- Restrict push access to Jenkins service account only
- Include administrators in restrictions

**`development` Branch Protection:**
- Require pull request reviews for team collaboration (optional)
- Allow force pushes with lease for rebasing (optional)
- Enable required status checks

### Workflow Benefits

This branching strategy provides several key advantages:

- **Separation of Concerns**: Development work is isolated from production deployments
- **Automated Quality Gates**: Multiple security and quality checks before production
- **Zero-Touch Deployments**: No manual intervention required for deployments
- **Audit Trail**: Complete Git history of all changes and deployments
- **Rollback Capability**: Easy reversion to previous versions via Git
- **CI Loop Prevention**: Clear separation between CI trigger (development) and CD trigger (master)
- **GitOps Compliance**: Git remains the single source of truth for production state

## 🏆 Key Technical Achievements

### Infrastructure Optimization
- **Challenge**: Out of Memory (OOM) crashes causing cluster instability
- **Root Cause**: Overcommitted resources on undersized VMs
- **Solution**: Redesigned architecture from 3 weak nodes (1GB each) to 2 optimized nodes (2GB+ each)
- **Result**: Achieved 99.9% cluster uptime and eliminated OOM kills

### CI/CD Pipeline Innovation
- **Challenge**: Jenkins initialization failures and Docker-in-Docker security issues
- **Solution**: 
  - Custom Jenkins Docker image with pre-installed plugins
  - Kaniko implementation for rootless container builds
  - Kubernetes-native agent provisioning
- **Result**: Reduced Jenkins startup from hours to seconds, enhanced security posture

### GitOps Implementation Excellence  
- **Challenge**: Configuration drift and manual deployment errors
- **Solution**: Complete GitOps adoption with ArgoCD App-of-Apps pattern
- **Result**: Git as single source of truth, zero-touch deployments, automatic drift correction

### Security Integration (DevSecOps)
- **Challenge**: Security scanning as an afterthought
- **Solution**: 
  - Integrated Snyk for SAST/SCA scanning in pipeline
  - Trivy for container vulnerability assessment
  - Security gates preventing vulnerable deployments
- **Result**: Shift-left security approach, automated vulnerability management

### Monitoring & Observability
- **Challenge**: Limited visibility into application and infrastructure performance  
- **Solution**: 
  - Prometheus metrics collection with custom ServiceMonitors
  - Grafana dashboards for visualization
  - Integration with application custom metrics
- **Result**: Complete observability stack with actionable insights

## 🔮 Future Enhancements

- **Advanced Alerting**: Alertmanager integration with Slack/PagerDuty notifications
- **Log Aggregation**: ELK Stack or Loki for centralized log management  
- **Service Mesh**: Istio integration for advanced traffic management
- **Secret Management**: HashiCorp Vault for dynamic secrets
- **Advanced Deployments**: Blue/Green and Canary deployment strategies
- **Backup & Disaster Recovery**: Velero integration for cluster backups
- **Policy Enforcement**: Open Policy Agent (OPA) for security policies

## 🤝 Contributing

This project serves as a comprehensive reference for modern DevOps practices. Each component has been thoroughly tested and documented for educational and production use.

## 📝 License

This project is open source and available under the MIT License.

---

**Built by me for the DevOps Community**

*This project represents hundreds of hours of hands-on DevOps engineering, solving real-world challenges from infrastructure failures to complex service discovery. Every configuration has been battle-tested in production scenarios, making it a reliable reference for enterprise DevOps implementations.*
