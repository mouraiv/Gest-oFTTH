FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["WebApiSwagger/WebApiSwagger.csproj", "WebApiSwagger/"]
RUN dotnet restore "WebApiSwagger/WebApiSwagger.csproj"
COPY . .
WORKDIR "/src/WebApiSwagger"
RUN dotnet build "WebApiSwagger.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "WebApiSwagger.dll"]