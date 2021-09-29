using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgePredictController : ControllerBase
    {
        private static readonly HttpClient client = new HttpClient();

        private static readonly string baseUrl = "https://api.agify.io";

        [HttpGet(Name = "GetAgeMultiply")]
        public async Task<IActionResult> GetAgeMultiply([FromQuery(Name = "names")] string[] names)
        {
            string queryString;
            if (names.Length == 0) return null;
            if (names.Length == 1)
            {
                queryString = "name=" + names.First();
            }
            else
            {
                queryString = "name[]=" + string.Join("&name[]=", names);
            }

            var response = await client.GetAsync(baseUrl + "?" + queryString);
            var responseString = await response.Content.ReadAsStringAsync();
            return Content(responseString, "application/json");
        }
    }
}
