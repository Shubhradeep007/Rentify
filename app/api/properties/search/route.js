import connectDb from "@/config/database";
import Property from "@/models/Property";

//GET /api/properties/search
export const GET = async (request) => {
  try {
    await connectDb();

    // get search query from the url or params
    const { searchParams } = new URL(request.url);

    // get location
    const location = searchParams.get("location");
    const propertyType = searchParams.get("propertyType");

    const locationPattern = new RegExp(location, "i");

    // create a query to match that pattern
    let query = {
      $or: [
        { name: locationPattern },
        { description: locationPattern },
        { "location.street": locationPattern },
        { "location.state": locationPattern },
        { "location.city": locationPattern },
        { "location.zipcode": locationPattern },
      ],
    };

    // only check for property if it is not 'All"
    if (propertyType && propertyType !== "All") {
      const typePattern = new RegExp(propertyType, "i");
      query.type = typePattern;
    }

    const properties = await Property.find(query);

    return new Response(JSON.stringify(properties, { status: 200 }));
  } catch (error) {
    // console.log(error);
    console.error("this is the error were looking for", error);
    return new Response(
      JSON.stringify("something went wrong", { status: 500 })
    );
  }
};
