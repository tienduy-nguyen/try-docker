FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /app
ENV ASPNETCORE_URLS="http://*:1886"

COPY *.csproj ./

RUN dotnet restore

COPY . ./
RUN dotnet publish -c release -o out


FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
EXPOSE 1886
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "simple-microservice.dll"]