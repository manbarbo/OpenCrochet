variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "opencrochet"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "allowed_origins" {
  description = "Allowed CORS origins"
  type        = string
}
