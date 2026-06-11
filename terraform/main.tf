terraform {
  backend "s3" {
    bucket         = "opencrochet-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "opencrochet-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
}

module "s3" {
  source = "./modules/s3"

  project_name    = var.project_name
  environment     = var.environment
  allowed_origins = var.allowed_origins
}

module "ec2" {
  source = "./modules/ec2"

  project_name     = var.project_name
  environment      = var.environment
  instance_type    = var.instance_type
  allowed_ssh_cidr = var.allowed_ssh_cidr
}

module "cloudfront" {
  source = "./modules/cloudfront"

  project_name  = var.project_name
  environment   = var.environment
  origin_domain = module.ec2.public_ip
}
