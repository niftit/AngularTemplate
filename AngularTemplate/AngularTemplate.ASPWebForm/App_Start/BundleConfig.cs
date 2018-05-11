using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Optimization;
using System.Web.UI;

namespace AngularTemplate.ASPWebForm
{
    public class BundleConfig
    {
        // For more information on Bundling, visit https://go.microsoft.com/fwlink/?LinkID=303951
        public static void RegisterBundles(BundleCollection bundles)
        {
            //reset bundle caches
            bundles.Clear();
            bundles.ResetAll();

            #region global css
            bundles.Add(new Bundle("~/css/GlobalCss").Include("~/css/global.css"));
            #endregion

            //constants.js only, for redirect.aspx file
            bundles.Add(new CustomScriptBundle("~/bundles/AngularAppConstants").Include("~/angular-app/constants.js"));

            #region angular app
            bundles.Add(new CustomScriptBundle("~/bundles/AngularApp").Include(
                                            //Initial files-->
                                            "~/angular-app/prototypes.js",
                                            "~/angular-app/utilities.js",
                                            "~/angular-app/constants.js",
                                            "~/angular-app/init.js",
                                            "~/angular-app/resources/text-resource.js")

                                            //Directive files
                                            .IncludeDirectory("~/angular-app/directives", "*.js", true)

                                            //Filter files
                                            .IncludeDirectory("~/angular-app/filters", "*.js", true)

                                            //Service files
                                            .IncludeDirectory("~/angular-app/services", "*.js", true)

                                            //Components files
                                            .IncludeDirectory("~/angular-app/components", "*.js", true)

                                            //Config files-->
                                            .Include(
                                            "~/angular-app/route-config.js ",
                                            "~/angular-app/app.js "));
            #endregion

            //the app name below must be same with app name that is defined in constants.js of the angular app.
            bundles.Add(new PartialsBundle("Privy", "~/bundles/AngularAppPartials").IncludeDirectory("~/angular-app", "*.html", true));
        }
    }

    public class CustomScriptBundle : ScriptBundle
    {
        public CustomScriptBundle(string virtualPath)
            : base(virtualPath)
        {
            this.Builder = new CustomScriptBuilder();
        }
        public CustomScriptBundle(string virtualPath, string cdnPath) : base(virtualPath, cdnPath) { }
    }

    public class CustomScriptBuilder : IBundleBuilder
    {
        //public string BuildBundleContent(Bundle bundle, BundleContext context, IEnumerable<BundleFile> files)
        //{
        //    throw new NotImplementedException();
        //}

        public string BuildBundleContent(Bundle bundle, BundleContext context, IEnumerable<FileInfo> files)
        {
            var content = new StringBuilder();
            foreach (var fileInfo in files)
            {
                var parser = new Microsoft.Ajax.Utilities.JSParser(Read(fileInfo));
                parser.Settings.AddRenamePair("delete", "fooDelete");
                parser.Settings.AddRenamePair("class", "fooClass");
                content.Append(parser.Parse(parser.Settings).ToCode());
                content.Append(";");
            }

            return content.ToString();
        }

        private string Read(FileInfo file)
        {
            using (var r = file.OpenText())
            {
                return r.ReadToEnd();
            }
        }
    }

    public class PartialsBundle : Bundle
    {
        public PartialsBundle(string moduleName, string virtualPath)
            : base(virtualPath, new[] { new PartialsTransform(moduleName) })
        {
        }
    }

    public class PartialsTransform : IBundleTransform
    {
        private readonly string _moduleName;
        public PartialsTransform(string moduleName)
        {
            _moduleName = moduleName;
        }

        public void Process(BundleContext context, BundleResponse response)
        {
            var strBundleResponse = new StringBuilder();
            // Javascript module for Angular that uses templateCache 
            strBundleResponse.AppendFormat(
                @"angular.module('{0}').run(['$templateCache',function(t){{",
                _moduleName);

            foreach (var file in response.Files)
            {
                // Get the partial page, remove line feeds and escape quotes
                var content = File.ReadAllText(file.FullName)
                    .Replace("\r\n", "").Replace("'", "\\'");
                // Create insert statement with template
                strBundleResponse.AppendFormat(
                    @"t.put('/{0}/{1}','{2}');", file.DirectoryName.Replace(HttpContext.Current.Server.MapPath("~"), "").Replace("\\", "/"), file.Name, content);
            }
            strBundleResponse.Append(@"}]);");

            response.Files = new FileInfo[] { };
            response.Content = strBundleResponse.ToString();
            response.ContentType = "text/javascript";
        }
    }

}