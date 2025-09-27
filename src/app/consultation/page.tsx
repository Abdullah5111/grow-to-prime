'use client'

export default function ConsultationPage() {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
          Free Consultation
        </h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below to schedule your free consultation with our experts.
        </p>

        <div className="max-w-4xl mx-auto">
          <iframe 
            aria-label="Lead Intake Questionnaire" 
            frameBorder="0" 
            style={{height: '500px', width: '99%', border: 'none'}} 
            src="https://forms.zohopublic.eu/growtoprime1/form/LeadIntakeQuestionnaire/formperma/euqcqAMxa5PxiVWyqITbTGT9yVYnL-pIamMUZDDhGrk"
            title="Lead Intake Questionnaire"
                  />
                </div>
              </div>
            </div>
  )
}