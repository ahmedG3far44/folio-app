import Container from "@components/ui/containers/Container";
import Header from "@components/ui/nav/Header";
import { revalidatePath } from "next/cache";
import credentials from "@credentials";
import Footer from "@components/ui/sections/Footer";
import MainProfilePreviewSection from "@components/ui/heroProfile/MainProfilePreviewSection";


const getUserLayouts = async (userId) => {
  try {
    const request = await fetch(`http://localhost:4000/api/${userId}/layouts`);
    const data = request.json();
    revalidatePath(`/${userId}`);
    return data;
  } catch (error) {
    return error.message;
  }
};

const getUserInfo = async (userId) => {
  try {
    const request = await fetch(`http://localhost:4000/api/${userId}/user`);
    const data = await request.json();
    revalidatePath(`/${userId}`);
    return data;
  } catch (error) {
    return error.message;
  }
};

async function UserPage({ params }) {
  const { userId } = params;
  const { user, isLogged } = await credentials();
  const userInfo = await getUserInfo(user?.id || userId);
  const layouts = await getUserLayouts(user?.id || userId);
  const {
    name,
    picture,
    bio,
    ExperiencesList,
    ProjectsList,
    SkillsList,
    contacts,
    Testimonials,
  } = userInfo;
  return (
    <div
      className="
     flex flex-col justify-start items-center gap-10 m-auto w-full max-w-full overflow-x-hidden overflow-y-auto no-scrollbar"
    >
      <Header userId={userId} picture={picture} username={name} />
      <Container className="w-full m-auto flex flex-col gap-16">
        <MainProfilePreviewSection
          layouts={layouts}
          ExperiencesList={ExperiencesList}
          ProjectsList={ProjectsList}
          SkillsList={SkillsList}
          TestimonialsList={Testimonials}
          bio={bio}
          contacts={contacts}
          isLogged={isLogged}
        />
      </Container>
      <Footer userId={userId} picture={picture} username={name} />
    </div>
  );
}

export default UserPage;
