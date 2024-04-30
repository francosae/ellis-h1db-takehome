import { notFound } from "next/navigation";

interface CaseDetails {
  BEGIN_DATE: string;
  CASE_NUMBER: string;
  CASE_STATUS: string;
  EMPLOYER_NAME: string;
  EMPLOYER_STATE: string;
  EMPLOYER_CITY: string;
  JOB_TITLE: string;
  RECEIVED_DATE: string;
  LAWFIRM_NAME_BUSINESS_NAME: string;
  SOC_TITLE: string;
  SOC_CODE: string;
  VISA_CLASS: string;
  WAGE_RATE_OF_PAY_FROM: number;
  WAGE_RATE_OF_PAY_TO: number;
  // not every field cuz its pretty long
}

async function fetchCaseDetails(caseId: string): Promise<CaseDetails> {
  const response = await fetch(
    `http://localhost:5000/case?case_number=${caseId}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.json();
}

export default async function Case({ params }: { params: { caseId: string } }) {
  const { caseId } = params;

  const caseDetails = await fetchCaseDetails(caseId).catch((error) => {
    console.error("Failed to fetch:", error);
    return notFound();
  });

  console.log(caseDetails);
  if (!caseDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className=" text-md flex justify-center rounded-lg p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold leading-7 text-gray-900">
            Case Information
          </h3>
          <p className="text-md mt-1 leading-6 text-gray-600">
            {caseDetails.CASE_NUMBER}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="px-4 py-5 text-center sm:px-6">
              <dt className="text-md font-medium text-gray-500">
                {caseDetails.SOC_TITLE} {caseDetails.SOC_CODE}
              </dt>
              <dd className="text-md mt-1 text-gray-900">
                {caseDetails.JOB_TITLE}
              </dd>
            </div>
            <div className="px-4 py-5 text-center sm:px-6">
              <dt className="text-md font-medium text-gray-500">Employer</dt>
              <dd className="text-md mt-1 text-gray-900">
                {caseDetails.EMPLOYER_NAME}
              </dd>
            </div>
            <div className="px-4 py-5 text-center sm:px-6">
              <dt className="text-md font-medium text-gray-500">Start Date</dt>
              <dd className="text-md mt-1 text-gray-900">
                {caseDetails.BEGIN_DATE}
              </dd>
            </div>
            <div className="px-4 py-5 text-center sm:px-6">
              <dt className="text-md font-medium text-gray-500">Location</dt>
              <dd className="text-md mt-1 text-gray-900">
                {caseDetails.EMPLOYER_CITY}, {caseDetails.EMPLOYER_STATE}
              </dd>
            </div>
            <div className="px-4 py-5 text-center sm:px-6">
              <dt className="text-md font-medium text-gray-500">
                Salary Range
              </dt>
              <dd className="text-md mt-1 text-gray-900">
                {caseDetails.WAGE_RATE_OF_PAY_TO ?? "null"} -{" "}
                {caseDetails.WAGE_RATE_OF_PAY_FROM}
              </dd>
            </div>
            <div className="px-4 py-5 text-center sm:px-6">
              <dt className="text-md font-medium text-gray-500">
                Lawfirm Name
              </dt>
              <dd className="text-md mt-1 text-gray-900">
                {caseDetails.LAWFIRM_NAME_BUSINESS_NAME}
              </dd>
            </div>

            <div className="px-4 py-5 text-center sm:px-6">
              <dt className="text-md font-medium text-gray-500">Visa Class</dt>
              <dd className="text-md mt-1 text-gray-900">
                {caseDetails.VISA_CLASS}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
