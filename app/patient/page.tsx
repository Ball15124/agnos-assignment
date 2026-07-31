import PatientForm from "@/features/patient/components/patientForm";

const PatientPage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-primary">Patient Form</h1>
        <p className="text-gray-600">
          Welcome to the patient form. Here you can input your information.
        </p>

        <PatientForm />
      </div>
    </div>
  );
};

export default PatientPage;
