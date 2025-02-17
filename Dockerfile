# ===== STAGE 1: Build the .NET application =====
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS builder

# Set working directory
WORKDIR /app

# Copy the solution file first (if you have one)
COPY ClientCraft.sln ./

# Copy the .NET project files
COPY ClientCraft/*.csproj ClientCraft/
COPY ClientCraft.Client/*.csproj ClientCraft.Client/
COPY ClientCraft.Core/*.csproj ClientCraft.Core/
COPY ClientCraft.Website/*.csproj ClientCraft.Website/
RUN dotnet restore ClientCraft.sln

# Copy the rest of the source code
COPY . .

# Build the .NET app
RUN dotnet build

# ===== STAGE 2: Build the Vite frontend assets =====
FROM node:20-alpine AS frontend-builder

# Set working directory for Vite
WORKDIR /app

# Copy package.json & package-lock.json first for caching
COPY ClientCraft.Client/assets/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY ClientCraft.Client/assets ./

# Build the frontend assets using Vite
RUN npm run build

# ===== STAGE 3: Final runtime image =====
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

# Set working directory
WORKDIR /app

# Copy the built .NET app from builder stage
COPY --from=builder /app/ClientCraft.Website/bin/Release/net9.0/ .

# Copy the built Vite assets to wwwroot
# COPY --from=frontend-builder /app/dist /app/wwwroot/App_Plugins/ClientCraft

# Expose the port for .NET
EXPOSE 8080

# Run the .NET app
ENTRYPOINT ["dotnet", "ClientCraft.Website.dll"]
