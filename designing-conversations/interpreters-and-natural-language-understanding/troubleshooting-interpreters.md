# Troubleshooting interpreters

## Steps to check when working with a knowledge base

* Make sure that your knowledge base is working in the NLU service. E.g.&#x20;
  * ![](../../.gitbook/assets/2023-06-16\_07-40-11.png)  ![](<../../.gitbook/assets/2023-06-16\_07-40-37 (1).png>)
  * Test your interpreter setup in OD. Note that success in OD doesn't mean that your knowledge base is working; you must check the previous step as well
    *

        <figure><img src="../../.gitbook/assets/2023-06-16_07-44-00.png" alt="This image shows the window to run the interpreter test in OD" width="375"><figcaption><p>Run interpreter test in OD</p></figcaption></figure>


    * Make sure your intent names align and use the names as shown in the image and the documentation. Check that your answer intent has an attribute message per the documentation.&#x20;
      * ![](<../../.gitbook/assets/2023-06-16\_07-44-00 copy.png>)  ![](../../.gitbook/assets/2023-06-16\_07-47-08.png)

## Troubleshooting

Q: Everything seems to be working but I get an empty answer in my preview.&#x20;

<figure><img src="../../.gitbook/assets/2023-06-15_14-42-00.png" alt="Preview screen showing empty KB answer"><figcaption><p>Preview screen showing empty KB answer</p></figcaption></figure>

A: The message in the context indicates that everything is working on the OD side, but in the knowledge base the answer is not retrieved. Go to your knowledge base and check that you are getting the answers using the test tool (see section above).&#x20;
