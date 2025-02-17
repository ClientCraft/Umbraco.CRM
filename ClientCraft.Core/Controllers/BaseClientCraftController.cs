﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace ClientCraft.Core.Controllers;

[ApiController]
[BackOfficeRoute("client-craft/v{version:apiVersion}/[controller]")]
[MapToApi("ClientCraft")]
public class ClientCraftCrmControllerBase : ControllerBase
{}