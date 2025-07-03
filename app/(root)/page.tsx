import Image from "next/image";
import SearchForm from "@/components/SearchForm";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch your startup
          <br />
          Connect with entrepreneurs
        </h1>
        <p className="subheading !max-w-3xl">
          Submit ideas, vote on pitches and get noticed in virtual competitions.
        </p>
        <SearchForm query={query} />
      </section>
    </>
  );
}
