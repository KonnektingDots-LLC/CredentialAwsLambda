const fs = require("fs");
const path = require("path");
const { default: puppeteer } = require("puppeteer-core");
const handlebars = require("handlebars");

module.exports = async function (context, req) {
    let data = req.body;	
	let templateHtml = fs.readFileSync(path.join(process.cwd(), `src/form.html`), 'utf8');
    let imageSrc = fs.readFileSync(path.join(process.cwd(), 'src/assets/images/logo-pr.png' ), "base64");
	let bootstrap = fs.readFileSync(path.join(process.cwd(), 'src/assets/css/bootstrap.min.css'));
	let CormorantGaramondBold = fs.readFileSync(path.join(process.cwd(), 'src/assets/css/cormorant-garamond/CormorantGaramond-Bold.woff'));
	let CormorantGaramondRegular = fs.readFileSync(path.join(process.cwd(), 'src/assets/css/cormorant-garamond/CormorantGaramond-Regular.woff'), "base64");
	let CormorantGaramondLight = fs.readFileSync(path.join(process.cwd(), 'src/assets/css/cormorant-garamond/CormorantGaramond-Light.woff'), "base64");
	let CormorantGaramondMedium = fs.readFileSync(path.join(process.cwd(), 'src/assets/css/cormorant-garamond/CormorantGaramond-Medium.woff'), "base64");
	let CormorantGaramondSemiBold = fs.readFileSync(path.join(process.cwd(), 'src/assets/css/cormorant-garamond/CormorantGaramond-SemiBold.woff'), "base64");
	let montserrat = fs.readFileSync(path.join(process.cwd(), 'src/assets/css/montserrat/029177df870cce2b384f0610a6e1f82a.woff'), "base64");

	if (data != null) {
		data["imageSrc"] = imageSrc;
		data["bootstrap"] = bootstrap;
		data["CormorantGaramondBold"] = CormorantGaramondBold;
		data["CormorantGaramondRegular"] = CormorantGaramondRegular;
		data["CormorantGaramondLight"] = CormorantGaramondLight;
		data["CormorantGaramondMedium"] = CormorantGaramondMedium;
		data["CormorantGaramondSemiBold"] = CormorantGaramondSemiBold;
		data["montserrat"] = montserrat;
	}
	else{
		data = {}
		data["imageSrc"] = imageSrc;
		data["bootstrap"] = bootstrap;
		data["CormorantGaramondBold"] = CormorantGaramondBold;
		data["CormorantGaramondRegular"] = CormorantGaramondRegular;
		data["CormorantGaramondLight"] = CormorantGaramondLight;
		data["CormorantGaramondMedium"] = CormorantGaramondMedium;
		data["CormorantGaramondSemiBold"] = CormorantGaramondSemiBold;
		data["montserrat"] = montserrat;
	}
	
    let milis = new Date();
	milis = milis.getTime();

	// To see output of pdf in project
	//let pdfPath = path.join(process.cwd(), 'src/assets/pdf/sample.pdf');

	let options = {
		width: '816px',
		height: '1056px',
		displayHeaderFooter: false,
		margin: {
			top: "48px",
			bottom: "25.92px",
			left: "48px",
			right:"48px"
		},
		printBackground: true,
		//path: pdfPath
	};

	let template = handlebars.compile(templateHtml);
	let html = template(data);

	let browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: true ,
		executablePath: '/opt/google/chrome/chrome'
		// executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
	});

	let page = await browser.newPage();
	await page.setDefaultNavigationTimeout(60000);
	
	await page.setContent(html, { waitUntil: 'networkidle0' });
	let pdf = await page.pdf(options);

	await browser.close();
	context.res = {
        // status: 200, /* Defaults to 200 */
       body: pdf,
       headers: {"Content-Disposition": `attachment; filename=sample.pdf`},
		
     };
	
}
